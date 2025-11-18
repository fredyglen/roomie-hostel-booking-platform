
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Upload, ArrowLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { GHANA_UNIVERSITIES, PREFERRED_UNIVERSITY_DISPLAY, SPECIFIC_PROGRAMS_BY_UNI } from '@/config/ghana-jurisdiction.config';


interface VerificationStepProps {
  idType: string;
  studentId: string;
  university: string;
  program: string;
  onInputChange: (name: string, value: string) => void;
  onFileUpload: (file: File) => void;
  onVerify: () => void;
  isVerifying: boolean;
  verified: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  idType,
  studentId,
  university,
  program,
  onInputChange,
  onFileUpload,
  onVerify,
  isVerifying,
  verified,
  onPrevious,
  onNext
}) => {
  const [uniOpen, setUniOpen] = React.useState(false);

  const universityOptions = React.useMemo(() => {
    return PREFERRED_UNIVERSITY_DISPLAY.map(({ code, label }) => {
      const fallbackPrograms = Array.isArray((GHANA_UNIVERSITIES as any)[code]?.specializations)
        ? ((GHANA_UNIVERSITIES as any)[code]?.specializations as string[])
        : [];
      const programs = (SPECIFIC_PROGRAMS_BY_UNI as any)[code] && (SPECIFIC_PROGRAMS_BY_UNI as any)[code].length > 0
        ? (SPECIFIC_PROGRAMS_BY_UNI as any)[code]
        : fallbackPrograms;
      return { label, programs };
    });
  }, []);

  const selectedUni = React.useMemo(
    () => universityOptions.find((u) => u.label === university) || null,
    [university, universityOptions]
  );

  const programsForSelectedUni = selectedUni ? selectedUni.programs : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const verificationRequired = import.meta.env.PROD && import.meta.env.VITE_REQUIRE_VERIFICATION !== 'false';
  const isValid = verificationRequired ? Boolean(idType && studentId && university && program && verified) : true;

  return (
    <div>
      {/* Mobile sticky header */}
      <div className="md:hidden sticky top-0 z-10 w-full bg-white">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button type="button" onClick={onPrevious} aria-label="Back" className="flex size-12 shrink-0 items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Step 4/5: Student Verification</h2>
          <div className="size-12 shrink-0"></div>
        </div>
        <div className="w-full bg-gray-100 h-1">
          <div className="bg-primary h-1" style={{ width: '80%' }}></div>
        </div>
      </div>

      <div className="space-y-6 px-4 md:px-0 pb-24 md:pb-0">
        <h2 className="hidden md:block text-xl font-bold">Student Verification</h2>
        <p className="text-sm text-gray-600">
          Please verify your student status to complete the booking.
        </p>

        <div>
          <Label htmlFor="idType">ID Type</Label>
          <Select value={idType} onValueChange={(value) => onInputChange('idType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studentId">Student ID Card</SelectItem>
              <SelectItem value="nationalId">National ID Card</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="studentId">Student ID Number</Label>
          <Input
            id="studentId"
            value={studentId}
            onChange={(e) => onInputChange('studentId', e.target.value)}
            placeholder="Enter your student ID number"
            required
          />
        </div>

        <div>
          <Label htmlFor="university">University/Institution</Label>
          <Popover open={uniOpen} onOpenChange={setUniOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={uniOpen} className="w-full justify-between">
                {university || "Select your university"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
              <Command>
                <CommandInput placeholder="Search university..." />
                <CommandList>
                  <CommandEmpty>No university found.</CommandEmpty>
                  <CommandGroup>
                    {universityOptions.map((u) => (
                      <CommandItem
                        key={u.label}
                        value={u.label}
                        onSelect={() => {
                          onInputChange('university', u.label);
                          onInputChange('program', '');
                          setUniOpen(false);
                        }}
                      >
                        {u.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="program">Program of Study</Label>
          <Select
            value={program}
            onValueChange={(v) => onInputChange('program', v)}
            disabled={!selectedUni}
          >
            <SelectTrigger id="program">
              <SelectValue placeholder={selectedUni ? "Select your program" : "Select a university first"} />
            </SelectTrigger>
            <SelectContent>
              {programsForSelectedUni.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="idImage">Upload ID Document</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Upload a clear photo of your ID</p>
            <input
              id="idImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('idImage')?.click()}
            >
              Choose File
            </Button>
          </div>
        </div>

        {!verified && (
          <Button
            onClick={onVerify}
            disabled={!verificationRequired || isVerifying || !idType || !studentId || !university || !program}
            className="w-full"
          >
            {isVerifying ? 'Verifying...' : 'Verify Student Status'}
          </Button>
        )}

        {verified && (
          <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-700">Student status verified successfully!</span>
          </div>
        )}

        {/* Desktop actions */}
        <div className="hidden md:flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button onClick={onNext} disabled={!isValid}>
            Next
          </Button>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-30 w-full bg-white p-4 border-t border-gray-200">
        <Button onClick={onNext} disabled={!isValid} className="w-full">
          Continue
        </Button>
      </footer>
    </div>
  );
};

export default VerificationStep;
