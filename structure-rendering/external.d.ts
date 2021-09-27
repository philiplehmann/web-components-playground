declare module JSX {
  type Element = HTMLElement | HTMLElement[];
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}