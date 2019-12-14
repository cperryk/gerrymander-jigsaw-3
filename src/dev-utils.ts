export function detectChanges(prevProps, prevState): void {
  Object.entries(this.props).forEach(
    ([key, val]) =>
      prevProps[key] !== val && console.log(`Prop '${key}' changed`)
  );
  if (this.state) {
    Object.entries(this.state).forEach(
      ([key, val]) =>
        prevState[key] !== val && console.log(`State '${key}' changed`)
    );
  }
}
