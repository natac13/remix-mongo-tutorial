export function validateEmail(email: string): string | undefined {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  // check if the email is valid
  if (!re.test(String(email).toLowerCase())) {
    return 'Invalid email'
  }
}

export function validatePassword(password: string): string | undefined {
  // check if the password is valid
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
}

export function validateName(name: string): string | undefined {
  // check if the name is valid
  if (name.length < 2) {
    return 'Name must be at least 2 characters'
  }
}
