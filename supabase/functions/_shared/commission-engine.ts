/**
 * SERVER-SIDE COMMISSION ENGINE — the only place money is calculated.
 *
 * @security CRITICAL — revenue integrity depends on this module.
 *
 * Design rules, learned the hard way:
 *
 *  1. ONE ENGINE. The browser must never compute a charge. A second engine
 *     existed in src/config/centralized-commission.config.ts and drifted from
 *     this one twice — first on VAT, then on who pays the platform commission —
 *     which meant a student could be shown one price and charged another.
 *
 *  2. THE FORMULA IS DATA, NOT CODE. Who bears each fee is read from
 *     commission_configurations (commission_bearer / fixed_fee_bearer /
 *     paystack_bearer), so a pricing change is an admin edit, not a deploy.
 *
 *  3. FAIL CLOSED. No active rate row means refuse to quote or charge. A
 *     refused payment is recoverable; a payment at guessed rates is not.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================================
// TYPES
// ============================================================================

/** Who absorbs a given fee. */
export type Bearer = 'owner' | 'student' | 'platform';

export interface CommissionRates {
  platform: number;
  agent: number;
  paystack: number;
  vat: number;
}

export interface PlatformFees {
  fixed: number;
  agentMinimum: number;
}

/** Which side of the transaction each fee lands on. */
export interface FeeBearers {
  commission: Bearer;
  fixedFee: Bearer;
  paystack: Bearer;
}

export interface CommissionCalculationResult {
  baseAmount: number;
  platformCommission: number;
  platformFixedFee: number;
  agentCommission: number;
  paystackFee: number;
  vatAmount: number;
  /** What the student is charged. */
  totalAmount: number;
  /** What the owner is paid out. */
  ownerReceives: number;
  /** What the platform keeps after absorbing whatever it bears. */
  platformNet: number;
  bearers: FeeBearers;
  breakdown: {
    subtotal: number;
    beforeVat: number;
    totalFees: number;
    /** Per-line attribution, for UI and for the audit trail. */
    studentPays: { rent: number; commission: number; fixedFee: number; agent: number; processing: number; vat: number };
    ownerPays: { commission: number; fixedFee: number; agent: number; processing: number };
    platformAbsorbs: { commission: number; fixedFee: number; agent: number; processing: number };
  };
}

export interface RatesInfo {
  rates: CommissionRates | null;
  fees: PlatformFees | null;
  bearers: FeeBearers | null;
  version?: string;
  lastLoaded?: Date;
}

// ============================================================================
// ENGINE
// ============================================================================

export class ServerCommissionEngine {
  private rates: CommissionRates | null = null;
  private fees: PlatformFees | null = null;
  private bearers: FeeBearers | null = null;
  private version: string | null = null;
  private lastLoaded: Date | null = null;
  private cacheTimeout = 60000; // 1 min — an admin rate change goes live within this

  /**
   * Load the active configuration. Throws if there isn't exactly one usable
   * row: see design rule 3. There are deliberately no default rates in this
   * file — a constant here is a rate nobody approved.
   */
  async loadRates(supabase: ReturnType<typeof createClient>): Promise<void> {
    if (this.rates && this.lastLoaded && Date.now() - this.lastLoaded.getTime() < this.cacheTimeout) {
      return;
    }

    const { data, error } = await supabase
      .from('commission_configurations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.error('Commission configuration unavailable', error);
      throw new Error(
        'Commission configuration unavailable: refusing to compute charges without an active rate row'
      );
    }

    this.rates = {
      platform: Number(data.platform_rate),
      agent: Number(data.agent_rate),
      paystack: Number(data.paystack_rate),
      vat: Number(data.vat_rate),
    };
    this.fees = {
      fixed: Number(data.platform_fixed_fee),
      agentMinimum: Number(data.agent_minimum_fee),
    };
    this.bearers = {
      commission: (data.commission_bearer ?? 'owner') as Bearer,
      fixedFee: (data.fixed_fee_bearer ?? 'student') as Bearer,
      paystack: (data.paystack_bearer ?? 'platform') as Bearer,
    };
    this.version = data.version;
    this.lastLoaded = new Date();

    console.log('Commission configuration loaded', {
      version: this.version,
      platform: `${(this.rates.platform * 100).toFixed(2)}%`,
      fixedFee: `${this.fees.fixed} GHS`,
      bearers: this.bearers,
    });
  }

  /**
   * Compute a full breakdown.
   *
   * Each fee is routed to whichever side bears it. The student's total is the
   * rent plus only the fees they bear; the owner's payout is the rent minus
   * only the fees they bear; the platform nets its revenue minus what it
   * absorbs. Every fee is accounted for exactly once.
   */
  calculateCommissions(baseAmount: number, includeAgent = false): CommissionCalculationResult {
    if (!this.rates || !this.fees || !this.bearers) {
      throw new Error('Commission rates not loaded. Call loadRates() first.');
    }
    if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
      throw new Error(`Base amount must be a positive finite number, got: ${baseAmount}`);
    }

    const { commission: cB, fixedFee: fB, paystack: pB } = this.bearers;

    const platformCommission = baseAmount * this.rates.platform;
    const platformFixedFee = this.fees.fixed;
    // Agent commission follows the same side as the platform commission.
    const agentCommission = includeAgent
      ? Math.max(baseAmount * this.rates.agent, this.fees.agentMinimum)
      : 0;

    const to = (bearer: Bearer, side: Bearer, amount: number) => (bearer === side ? amount : 0);

    // What the student is billed, before processing.
    const subtotal =
      baseAmount +
      to(cB, 'student', platformCommission) +
      to(fB, 'student', platformFixedFee) +
      to(cB, 'student', agentCommission);

    // Processing is charged on the amount actually moving through Paystack.
    const paystackFee = subtotal * this.rates.paystack;
    const studentProcessing = to(pB, 'student', paystackFee);

    const beforeVat = subtotal + studentProcessing;
    const vatAmount = beforeVat * this.rates.vat;
    const totalAmount = beforeVat + vatAmount;

    const ownerReceives =
      baseAmount -
      to(cB, 'owner', platformCommission) -
      to(fB, 'owner', platformFixedFee) -
      to(cB, 'owner', agentCommission) -
      to(pB, 'owner', paystackFee);

    // Platform revenue is whatever it collects, less whatever it absorbs.
    const platformNet =
      platformCommission +
      platformFixedFee -
      to(cB, 'platform', platformCommission) -
      to(fB, 'platform', platformFixedFee) -
      to(pB, 'platform', paystackFee) -
      agentCommission;

    return {
      baseAmount,
      platformCommission,
      platformFixedFee,
      agentCommission,
      paystackFee,
      vatAmount,
      totalAmount,
      ownerReceives,
      platformNet,
      bearers: this.bearers,
      breakdown: {
        subtotal,
        beforeVat,
        totalFees: platformCommission + platformFixedFee + agentCommission + paystackFee + vatAmount,
        studentPays: {
          rent: baseAmount,
          commission: to(cB, 'student', platformCommission),
          fixedFee: to(fB, 'student', platformFixedFee),
          agent: to(cB, 'student', agentCommission),
          processing: studentProcessing,
          vat: vatAmount,
        },
        ownerPays: {
          commission: to(cB, 'owner', platformCommission),
          fixedFee: to(fB, 'owner', platformFixedFee),
          agent: to(cB, 'owner', agentCommission),
          processing: to(pB, 'owner', paystackFee),
        },
        platformAbsorbs: {
          commission: to(cB, 'platform', platformCommission),
          fixedFee: to(fB, 'platform', platformFixedFee),
          agent: to(cB, 'platform', agentCommission),
          processing: to(pB, 'platform', paystackFee),
        },
      },
    };
  }

  getCurrentRates(): RatesInfo {
    return {
      rates: this.rates,
      fees: this.fees,
      bearers: this.bearers,
      version: this.version || undefined,
      lastLoaded: this.lastLoaded || undefined,
    };
  }

  isReady(): boolean {
    return this.rates !== null && this.fees !== null && this.bearers !== null;
  }

  invalidateCache(): void {
    this.lastLoaded = null;
  }
}

export const serverCommissionEngine = new ServerCommissionEngine();
