#!/usr/bin/env python3
"""Test script to check Supabase connection and data"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check environment variables
print("=" * 60)
print("VERIFICANDO VARIABLES DE ENTORNO")
print("=" * 60)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print(
    f"✓ SUPABASE_URL: {SUPABASE_URL if SUPABASE_URL else '❌ NO CONFIGURADO'}")
print(
    f"✓ SUPABASE_SERVICE_ROLE_KEY: {'✓ Configurado' if SUPABASE_KEY else '❌ NO CONFIGURADO'}")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("\n❌ Error: Las variables de Supabase no están configuradas")
    sys.exit(1)

# Try to connect to Supabase
print("\n" + "=" * 60)
print("CONECTANDO A SUPABASE")
print("=" * 60)

try:
    from supabase import create_client, Client
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✓ Cliente de Supabase creado correctamente")
except Exception as e:
    print(f"❌ Error al crear cliente: {e}")
    sys.exit(1)

# Check if profiles table exists and has data
print("\n" + "=" * 60)
print("VERIFICANDO TABLA 'profiles'")
print("=" * 60)

try:
    response = supabase.table('profiles').select('*').execute()

    if hasattr(response, 'data'):
        data = response.data
    elif isinstance(response, dict):
        data = response.get('data', [])
    else:
        data = response

    print(f"✓ Tabla 'profiles' accesible")
    print(f"✓ Total de usuarios: {len(data)}")

    if data:
        print("\nPrimeros usuarios:")
        for i, user in enumerate(data[:3], 1):
            print(f"\n  Usuario {i}:")
            for key, value in user.items():
                print(f"    - {key}: {value}")
    else:
        print("\n⚠️ AVISO: No hay usuarios en la tabla 'profiles'")
        print("   Necesitas registrar usuarios en tu aplicación primero")

except Exception as e:
    print(f"❌ Error al acceder a 'profiles': {e}")
    print("   Verifica que:")
    print("   - La tabla 'profiles' existe en Supabase")
    print("   - Tu SUPABASE_SERVICE_ROLE_KEY es válida")
    print("   - Tienes permiso para leer la tabla")
    sys.exit(1)

print("\n" + "=" * 60)
print("✓ Todo parece estar configurado correctamente!")
print("=" * 60)
