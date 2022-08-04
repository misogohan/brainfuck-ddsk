type Position = { line: number; column: number; };
type Token = 
  | { kind: '>' | '<' | '+' | '-' | '.' | ','; p: Position; }
  | { kind: '[' | ']'; p: Position; matched: number; }
;
const parse = (code: string): Token[] => {
  let tokens: Token[] = [];
  const loop_stack: number[] = [];
  for (const [i, l] of code.split('\n').entries()) {
    for (const [j, c] of [...l].entries()) {
      const p = { line: i + 1, column: j + 1 };
      switch (c) {
        case '>': 
        case '<': 
        case '+': 
        case '-':
        case '.':
        case ',': tokens.push({ kind: c, p }); break;
        case '[': {
          loop_stack.push(tokens.length);
          tokens.push({ kind: '[', p, matched: tokens.length });
          break;
        }
        case ']': {
          const tokenI = loop_stack.pop();
          if (tokenI == null) throw Error('too much closing blackets');
          const matching = tokens[tokenI];
          // @ts-ignore
          matching.matched = tokens.length;
          tokens.push({ kind: ']', p, matched: tokenI });
          break;
        }
      }
    }
  }
  if (loop_stack.length) throw Error('too much opening blackets');
  return tokens;
};

const noInput = function *() {}();
export const run = (code: string, input: Iterator<number> = noInput) => {
  const bytes = new Uint8Array(4096);
  let idx = 0;
  const outChars: number[] = [];

  const tokens = parse(code);
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i];
    switch (token.kind) {
      case '>': ++idx; break;
      case '<': --idx; break;
      case '+': ++bytes[idx]; break;
      case '-': --bytes[idx]; break;
      case '.': outChars.push(bytes[idx]); break;
      case ',': {
        const inputByte = input.next();
        if (inputByte.done) throw Error('insufficient input');
        bytes[idx] = inputByte.value;
        break;
      }
      case '[': if (!bytes[idx]) i = token.matched; break;
      case ']': if (bytes[idx]) i = token.matched; break;
    }
  }
  return new TextDecoder().decode(new Uint8Array(outChars));
}

