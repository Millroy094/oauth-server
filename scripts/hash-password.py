import os
import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()

if __name__ == "__main__":
    password = os.getenv("PASSWORD")
    hashed = hash_password(password)
    print(f"::set-output name=hashed_password::{hashed}")