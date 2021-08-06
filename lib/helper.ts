export function joinClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function UtcTime() {
  return new Date().toISOString()
}
