import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  UserInsert, 
  UserUpdate, 
  UserRole 
} from '@/types/UserTypes';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/CommonTypes';

// Get all users with pagination
export async function getUsers(
  params: PaginationParams & { role?: UserRole } = { page: 1, pageSize: 10 }
): Promise<ApiResponse<PaginatedResponse<User>>> {
  try {
    const { page = 1, pageSize = 10, role } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // Apply role filter if provided
    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: {
        data: data as User[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch users',
        details: error
      }
    };
  }
}

// Get a single user by ID
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as User
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch user',
        details: error
      }
    };
  }
}

// Create a new user
export async function createUser(user: UserInsert): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as User
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create user',
        details: error
      }
    };
  }
}

// Update an existing user
export async function updateUser(
  id: string, 
  user: UserUpdate
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as User
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update user',
        details: error
      }
    };
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: null
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to delete user',
        details: error
      }
    };
  }
}

// Get user profile
export async function getUserProfile(): Promise<ApiResponse<User>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as User
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch user profile',
        details: error
      }
    };
  }
}

// Update user profile
export async function updateUserProfile(profile: UserUpdate): Promise<ApiResponse<User>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as User
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update user profile',
        details: error
      }
    };
  }
}