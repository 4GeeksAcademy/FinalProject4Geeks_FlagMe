import os
from supabase import create_client, Client

# Supabase configuration
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Initialize Supabase client (used for auth operations)
supabase: Client = create_client(url, key)

# Dedicated admin client for DB operations.
# Never used for auth.sign_up/sign_in so its session is never
# replaced by a user JWT, ensuring the service role key bypasses RLS.
supabase_admin: Client = create_client(url, key)
