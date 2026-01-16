import { useState, useCallback } from 'react';
import { Header, ContentPanel } from './components';
import { CodeEditor } from './components/editor/CodeEditor';
import { OutputPanel } from './components/editor/OutputPanel';
import { RunButton } from './components/editor/RunButton';
import { useLeoExecutor } from './hooks/useLeoExecutor';

// Lesson data - Structured course for learning Leo
const lessons = [
  // ==================== SECTION 1: INTRODUCTION ====================
  {
    title: 'Welcome to Leo',
    content: (
      <>
        <p>
          Welcome to <strong>Exploring Leo</strong> — an interactive course designed to teach you Leo, 
          the programming language for building private applications on the <strong>Aleo blockchain</strong>.
        </p>
        <p className="mt-4">
          If you're coming from Solidity, Rust, or other smart contract languages, you'll find Leo 
          familiar yet uniquely powerful. Leo enables you to write programs that execute with 
          <strong> zero-knowledge proofs</strong>, meaning computations can be verified without revealing the underlying data.
        </p>
        <p className="mt-4">
          <strong>What makes Leo special:</strong>
        </p>
        <ul className="mt-2">
          <li><strong>Privacy by default</strong> — inputs are private unless explicitly made public</li>
          <li><strong>Zero-knowledge proofs</strong> — verify computations without revealing data</li>
          <li><strong>Statically typed</strong> — catch errors at compile time</li>
          <li><strong>Developer friendly</strong> — familiar syntax inspired by Rust</li>
        </ul>
        <p className="mt-4">
          Use the <strong>Next</strong> button below to progress through the lessons. Let's begin!
        </p>
      </>
    ),
    code: ``,
  },
  {
    title: 'Your First Leo Program',
    content: (
      <>
        <p>
          Let's start with the classic "Hello World" — but in Leo style. Every Leo program 
          starts with a <code>program</code> declaration.
        </p>
        <p className="mt-4">
          <strong>Key concepts:</strong>
        </p>
        <ul className="mt-2">
          <li><code>program name.aleo</code> — declares a program with a unique ID</li>
          <li><code>transition</code> — the entry point that can be called externally</li>
          <li><code>return</code> — returns a value from the transition</li>
        </ul>
        <p className="mt-4">
          The program ID follows the format <code>name.aleo</code> where:
        </p>
        <ul className="mt-2">
          <li>The name must start with a lowercase letter</li>
          <li>Can only contain lowercase letters, numbers, and underscores</li>
          <li><code>.aleo</code> is the network domain</li>
        </ul>
        <p className="mt-4">
          Click <strong>Run</strong> to execute your first Leo program!
        </p>
      </>
    ),
    code: `program hello.aleo {
    transition main() -> u32 {
        return 42u32;
    }
}`,
  },
  // ==================== SECTION 2: DATA TYPES ====================
  {
    title: 'Variables & Type Annotations',
    content: (
      <>
        <p>
          Leo is <strong>statically typed</strong> — every variable must have a known type at compile time.
          Unlike JavaScript or Python, Leo does not support <code>null</code> or <code>undefined</code> values.
        </p>
        <p className="mt-4">
          <strong>Declaring variables:</strong>
        </p>
        <ul className="mt-2">
          <li><code>let x: u32 = 5u32;</code> — explicit type annotation</li>
          <li><code>let y = 10u32;</code> — type inferred from the value</li>
        </ul>
        <p className="mt-4">
          Notice how integer literals include their type suffix (like <code>5u32</code>). 
          This is required in Leo to avoid ambiguity.
        </p>
        <p className="mt-4">
          <strong>Important:</strong> All values in Leo are <strong>passed by value</strong>, 
          meaning they are copied when assigned or passed to functions.
        </p>
      </>
    ),
    code: `program variables.aleo {
    transition main() -> u32 {
        // Explicit type annotation
        let a: u32 = 5u32;
        
        // Type must be explicit in Leo
        let b: u32 = 10u32;
        
        // Variables can be reassigned
        let c: u32 = a + b;
        
        return c;
    }
}`,
  },
  {
    title: 'Booleans',
    content: (
      <>
        <p>
          The <code>bool</code> type in Leo represents a boolean value — either <code>true</code> or <code>false</code>.
        </p>
        <p className="mt-4">
          <strong>Boolean operations:</strong>
        </p>
        <ul className="mt-2">
          <li><code>&&</code> — logical AND</li>
          <li><code>||</code> — logical OR</li>
          <li><code>!</code> — logical NOT</li>
        </ul>
        <p className="mt-4">
          Booleans are commonly used in conditional statements and for storing flags or state.
        </p>
      </>
    ),
    code: `program booleans.aleo {
    transition main() -> bool {
        let is_active: bool = true;
        let is_verified: bool = false;
        
        // Logical operations
        let both: bool = is_active && is_verified;
        let either: bool = is_active || is_verified;
        let negated: bool = !is_active;
        
        return either;
    }
}`,
  },
  {
    title: 'Integers',
    content: (
      <>
        <p>
          Leo supports both <strong>signed</strong> and <strong>unsigned</strong> integers 
          with various bit lengths.
        </p>
        <p className="mt-4">
          <strong>Unsigned integers</strong> (positive only):
        </p>
        <ul className="mt-2">
          <li><code>u8</code>, <code>u16</code>, <code>u32</code>, <code>u64</code>, <code>u128</code></li>
        </ul>
        <p className="mt-4">
          <strong>Signed integers</strong> (positive and negative):
        </p>
        <ul className="mt-2">
          <li><code>i8</code>, <code>i16</code>, <code>i32</code>, <code>i64</code>, <code>i128</code></li>
        </ul>
        <p className="mt-4">
          <strong>Tip:</strong> Use underscores <code>_</code> to make large numbers readable: <code>1_000_000u64</code>
        </p>
        <p className="mt-4 text-yellow-400">
          ⚠️ Higher bit lengths generate more constraints, which can slow down proof generation.
        </p>
      </>
    ),
    code: `program integers.aleo {
    transition main() -> i64 {
        // Unsigned integers
        let small: u8 = 255u8;
        let medium: u32 = 1_000_000u32;
        let large: u128 = 1_000_000_000u128;
        
        // Signed integers (can be negative)
        let positive: i32 = 100i32;
        let negative: i64 = -50i64;
        
        return negative;
    }
}`,
  },
  {
    title: 'Field Elements',
    content: (
      <>
        <p>
          The <code>field</code> type represents elements of the base field of the elliptic curve 
          used in Aleo's cryptography.
        </p>
        <p className="mt-4">
          Field elements are essential for:
        </p>
        <ul className="mt-2">
          <li>Cryptographic operations</li>
          <li>Hash function outputs</li>
          <li>Zero-knowledge proof computations</li>
        </ul>
        <p className="mt-4">
          They are unsigned integers less than the field modulus — a very large prime number.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>let x: field = 123field;</code>
        </p>
      </>
    ),
    code: `program fields.aleo {
    transition main() -> field {
        let a: field = 1field;
        let b: field = 2field;
        
        // Field arithmetic
        let sum: field = a + b;
        let product: field = a * b;
        
        return sum;
    }
}`,
  },
  {
    title: 'Addresses',
    content: (
      <>
        <p>
          The <code>address</code> type represents an Aleo account address. 
          Addresses are fundamental to Leo programs as they identify users and program owners.
        </p>
        <p className="mt-4">
          <strong>Special address constants:</strong>
        </p>
        <ul className="mt-2">
          <li><code>self.caller</code> — the address that called the transition</li>
          <li><code>self.signer</code> — the address that signed the transaction</li>
        </ul>
        <p className="mt-4">
          Addresses are commonly used for:
        </p>
        <ul className="mt-2">
          <li>Identifying token owners in records</li>
          <li>Access control and permissions</li>
          <li>Mapping keys for account balances</li>
        </ul>
      </>
    ),
    code: `program addresses.aleo {
    transition main() -> address {
        // self.caller is the address calling this transition
        let caller: address = self.caller;
        
        // self.signer is who signed the transaction
        let signer: address = self.signer;
        
        return caller;
    }
}`,
  },
  {
    title: 'Group & Scalar',
    content: (
      <>
        <p>
          Leo provides two additional cryptographic types: <code>group</code> and <code>scalar</code>.
        </p>
        <p className="mt-4">
          <strong>Group elements:</strong>
        </p>
        <ul className="mt-2">
          <li>Points on the elliptic curve</li>
          <li>Used in advanced cryptographic operations</li>
          <li>Access the generator point with <code>group::GEN</code></li>
        </ul>
        <p className="mt-4">
          <strong>Scalar elements:</strong>
        </p>
        <ul className="mt-2">
          <li>Elements of the scalar field</li>
          <li>Used to multiply group elements</li>
          <li>Important for signature schemes</li>
        </ul>
      </>
    ),
    code: `program crypto_types.aleo {
    transition main() -> group {
        // Group element (point on curve)
        let g: group = group::GEN;
        let point: group = 0group;
        
        // Scalar element
        let s: scalar = 1scalar;
        
        // Scalar multiplication
        let result: group = s * g;
        
        return result;
    }
}`,
  },
  {
    title: 'Option Types',
    content: (
      <>
        <p>
          Leo supports <strong>option types</strong> using the <code>T?</code> syntax for values that may or may not exist.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong>
        </p>
        <ul className="mt-2">
          <li><code>let x: u32? = 42u32;</code> — has a value</li>
          <li><code>let y: u32? = none;</code> — no value</li>
        </ul>
        <p className="mt-4">
          <strong>Unwrapping options:</strong>
        </p>
        <ul className="mt-2">
          <li><code>.unwrap()</code> — get value (fails if none)</li>
          <li><code>.unwrap_or(default)</code> — get value or default</li>
        </ul>
        <p className="mt-4 text-yellow-400">
          ⚠️ Option types are not available for <code>address</code>, <code>signature</code>, or <code>tuple</code>.
        </p>
      </>
    ),
    code: `program options.aleo {
    // Note: Option types use special syntax
    // This demo shows basic operations
    
    transition main() -> u32 {
        // In Leo, options are handled differently
        // Using regular values for this demo
        let value: u32 = 42u32;
        let default_val: u32 = 100u32;
        
        // Conditional logic instead of Option
        let use_default: bool = false;
        let result: u32 = use_default ? default_val : value;
        
        return result;
    }
}`,
  },
  // ==================== SECTION 3: OPERATORS ====================
  {
    title: 'Arithmetic Operators',
    content: (
      <>
        <p>
          Leo supports standard arithmetic operators. By default, Leo uses <strong>checked arithmetic</strong> — 
          it will error on overflow or division by zero.
        </p>
        <p className="mt-4">
          <strong>Available operators:</strong>
        </p>
        <ul className="mt-2">
          <li><code>+</code> — addition</li>
          <li><code>-</code> — subtraction</li>
          <li><code>*</code> — multiplication</li>
          <li><code>/</code> — division</li>
          <li><code>%</code> — remainder (modulo)</li>
          <li><code>**</code> — exponentiation</li>
        </ul>
        <p className="mt-4 text-yellow-400">
          ⚠️ Operations must be between the same types. Leo has no implicit type conversions.
        </p>
      </>
    ),
    code: `program arithmetic.aleo {
    transition main() -> u32 {
        let a: u32 = 10u32;
        let b: u32 = 3u32;
        
        let sum: u32 = a + b;       // 13
        let diff: u32 = a - b;      // 7
        let product: u32 = a * b;   // 30
        let quotient: u32 = a / b;  // 3
        let remainder: u32 = a % b; // 1
        let power: u32 = a ** 2u32; // 100
        
        return sum;
    }
}`,
  },
  {
    title: 'Wrapped Arithmetic',
    content: (
      <>
        <p>
          By default, Leo uses <strong>checked arithmetic</strong> that halts on overflow.
          For cases where you need wrapping behavior, use the <code>_wrapped</code> variants.
        </p>
        <p className="mt-4">
          <strong>Wrapped operators:</strong>
        </p>
        <ul className="mt-2">
          <li><code>.add_wrapped()</code> — wrapping addition</li>
          <li><code>.sub_wrapped()</code> — wrapping subtraction</li>
          <li><code>.mul_wrapped()</code> — wrapping multiplication</li>
          <li><code>.div_wrapped()</code> — wrapping division</li>
          <li><code>.pow_wrapped()</code> — wrapping exponentiation</li>
        </ul>
        <p className="mt-4">
          When overflow occurs, the value wraps around to the beginning of the type's range.
        </p>
      </>
    ),
    code: `program wrapped.aleo {
    transition main() -> u8 {
        let max: u8 = 255u8;
        
        // Normal add would halt on overflow
        // let overflow: u8 = max + 1u8; // ERROR!
        
        // Wrapped add wraps around to 0
        let wrapped: u8 = max.add_wrapped(1u8); // 0u8
        
        // Wrapped multiplication
        let big: u8 = 128u8;
        let doubled: u8 = big.mul_wrapped(2u8); // 0u8
        
        return wrapped;
    }
}`,
  },
  {
    title: 'Comparison Operators',
    content: (
      <>
        <p>
          Comparison operators return boolean values and are used to compare values of the same type.
        </p>
        <p className="mt-4">
          <strong>Comparison operators:</strong>
        </p>
        <ul className="mt-2">
          <li><code>==</code> — equal to</li>
          <li><code>!=</code> — not equal to</li>
          <li><code>&lt;</code> — less than</li>
          <li><code>&gt;</code> — greater than</li>
          <li><code>&lt;=</code> — less than or equal</li>
          <li><code>&gt;=</code> — greater than or equal</li>
        </ul>
        <p className="mt-4">
          These are essential for control flow and conditional logic.
        </p>
      </>
    ),
    code: `program comparisons.aleo {
    transition main() -> bool {
        let a: u32 = 10u32;
        let b: u32 = 20u32;
        
        let is_equal: bool = a == b;      // false
        let not_equal: bool = a != b;     // true
        let less_than: bool = a < b;      // true
        let greater_than: bool = a > b;   // false
        let less_eq: bool = a <= b;       // true
        let greater_eq: bool = a >= b;    // false
        
        return less_than;
    }
}`,
  },
  {
    title: 'Bitwise Operators',
    content: (
      <>
        <p>
          Leo supports bitwise operations on integer types, useful for low-level data manipulation.
        </p>
        <p className="mt-4">
          <strong>Bitwise operators:</strong>
        </p>
        <ul className="mt-2">
          <li><code>&</code> — bitwise AND</li>
          <li><code>|</code> — bitwise OR</li>
          <li><code>^</code> — bitwise XOR</li>
          <li><code>&lt;&lt;</code> — left shift</li>
          <li><code>&gt;&gt;</code> — right shift</li>
        </ul>
        <p className="mt-4">
          These operators are commonly used for flags, masks, and efficient multiplication/division by powers of 2.
        </p>
      </>
    ),
    code: `program bitwise.aleo {
    transition main() -> u8 {
        let a: u8 = 10u8;  // 0b1010 in binary
        let b: u8 = 12u8;  // 0b1100 in binary
        
        let and_result: u8 = a & b;   // 8  (0b1000)
        let or_result: u8 = a | b;    // 14 (0b1110)
        let xor_result: u8 = a ^ b;   // 6  (0b0110)
        
        // Shift operations
        let left: u8 = a << 1u8;      // 20
        let right: u8 = a >> 1u8;     // 5
        
        return xor_result;
    }
}`,
  },
  // ==================== SECTION 4: CONTROL FLOW ====================
  {
    title: 'Conditional Statements',
    content: (
      <>
        <p>
          Leo supports <code>if</code>, <code>else if</code>, and <code>else</code> for conditional execution.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong>
        </p>
        <pre className="mt-2 p-2 bg-neutral-800 rounded text-sm">
{`if condition {
    // code
} else if other_condition {
    // code
} else {
    // code
}`}
        </pre>
        <p className="mt-4">
          The condition must be a boolean expression. Conditional statements can be nested.
        </p>
      </>
    ),
    code: `program conditionals.aleo {
    transition main() -> u32 {
        let value: u32 = 42u32;
        let result: u32 = 0u32;
        
        if value < 10u32 {
            result = 1u32;
        } else if value < 100u32 {
            result = 2u32;
        } else {
            result = 3u32;
        }
        
        return result;
    }
}`,
  },
  {
    title: 'Ternary Expressions',
    content: (
      <>
        <p>
          For simple conditional assignments, Leo supports <strong>ternary expressions</strong>.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>condition ? value_if_true : value_if_false</code>
        </p>
        <p className="mt-4">
          Ternary expressions can be nested, but keep them simple for readability.
        </p>
        <p className="mt-4">
          They're perfect for:
        </p>
        <ul className="mt-2">
          <li>Computing min/max values</li>
          <li>Setting default values</li>
          <li>Simple conditional assignments</li>
        </ul>
      </>
    ),
    code: `program ternary.aleo {
    transition main() -> u32 {
        let a: u32 = 25u32;
        let b: u32 = 10u32;
        
        // Simple ternary
        let max: u32 = a > b ? a : b;
        let min: u32 = a < b ? a : b;
        
        // Nested ternary (use sparingly)
        let category: u32 = a < 10u32 ? 1u32 
                          : (a < 100u32 ? 2u32 : 3u32);
        
        return max;
    }
}`,
  },
  {
    title: 'For Loops',
    content: (
      <>
        <p>
          Leo supports <code>for</code> loops with a key constraint: 
          <strong> loop bounds must be constant</strong> (known at compile time).
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>for i: type in start..end</code>
        </p>
        <p className="mt-4">
          <strong>Important notes:</strong>
        </p>
        <ul className="mt-2">
          <li>Loop bounds must be integer constants of the same type</li>
          <li>The range is exclusive: <code>0..5</code> iterates 0, 1, 2, 3, 4</li>
          <li>Nested loops are supported</li>
          <li>If start ≥ end, the loop body doesn't execute</li>
        </ul>
        <p className="mt-4 text-yellow-400">
          ⚠️ Loops are "unrolled" at compile time — large loops increase circuit size.
        </p>
      </>
    ),
    code: `program loops.aleo {
    transition main() -> u32 {
        let sum: u32 = 0u32;
        
        // Loop from 0 to 4 (exclusive of 5)
        for i: u32 in 0u32..5u32 {
            sum += i;
        }
        // sum = 0 + 1 + 2 + 3 + 4 = 10
        
        return sum;
    }
}`,
  },
  // ==================== SECTION 5: COMPOSITE TYPES ====================
  {
    title: 'Arrays',
    content: (
      <>
        <p>
          Leo supports <strong>static arrays</strong> with fixed length known at compile time.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>[type; length]</code>
        </p>
        <p className="mt-4">
          <strong>Key points:</strong>
        </p>
        <ul className="mt-2">
          <li>Array length must be a constant</li>
          <li>Elements must be the same type</li>
          <li>Access elements with constant indices: <code>arr[0u32]</code></li>
          <li>Nested arrays are supported: <code>[[u32; 2]; 3]</code></li>
        </ul>
        <p className="mt-4 text-yellow-400">
          ⚠️ Array indices must be constant expressions (known at compile time).
        </p>
      </>
    ),
    code: `program arrays.aleo {
    transition main() -> u32 {
        // Initialize an array
        let arr: [u32; 4] = [1u32, 2u32, 3u32, 4u32];
        
        // Access elements (index must be constant)
        let first: u32 = arr[0u32];
        let last: u32 = arr[3u32];
        
        // Nested array
        let matrix: [[u32; 2]; 2] = [
            [1u32, 2u32],
            [3u32, 4u32]
        ];
        
        return first + last;
    }
}`,
  },
  {
    title: 'Tuples',
    content: (
      <>
        <p>
          <strong>Tuples</strong> group multiple values of different types into a single compound value.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>(type1, type2, ...)</code>
        </p>
        <p className="mt-4">
          <strong>Key points:</strong>
        </p>
        <ul className="mt-2">
          <li>Elements can have different types</li>
          <li>Access elements with dot notation: <code>tuple.0</code>, <code>tuple.1</code></li>
          <li>Cannot be empty</li>
          <li>Useful for returning multiple values</li>
        </ul>
      </>
    ),
    code: `program tuples.aleo {
    transition main() -> u32 {
        // Create a tuple with mixed types
        let pair: (u32, bool) = (42u32, true);
        
        // Access tuple elements
        let number: u32 = pair.0;
        let flag: bool = pair.1;
        
        // Tuple with three elements
        let triple: (u8, u16, u32) = (1u8, 2u16, 3u32);
        
        return number;
    }
}`,
  },
  {
    title: 'Structs',
    content: (
      <>
        <p>
          <strong>Structs</strong> are custom data types that group related values with named fields.
        </p>
        <p className="mt-4">
          <strong>Defining a struct:</strong>
        </p>
        <pre className="mt-2 p-2 bg-neutral-800 rounded text-sm">
{`struct Point {
    x: u32,
    y: u32,
}`}
        </pre>
        <p className="mt-4">
          <strong>Key points:</strong>
        </p>
        <ul className="mt-2">
          <li>Structs must be defined inside the program scope</li>
          <li>Fields are accessed with dot notation: <code>point.x</code></li>
          <li>Structs are passed by value (copied)</li>
        </ul>
      </>
    ),
    code: `program structs.aleo {
    struct Point {
        x: u32,
        y: u32,
    }
    
    transition main() -> u32 {
        // Create a struct instance
        let p: Point = Point {
            x: 10u32,
            y: 20u32,
        };
        
        // Access fields
        let sum: u32 = p.x + p.y;
        
        return sum;
    }
}`,
  },
  // ==================== SECTION 6: FUNCTIONS ====================
  {
    title: 'Transitions',
    content: (
      <>
        <p>
          <strong>Transitions</strong> are the primary entry points of a Leo program. 
          They can be called externally and are where zero-knowledge proofs are generated.
        </p>
        <p className="mt-4">
          <strong>Key characteristics:</strong>
        </p>
        <ul className="mt-2">
          <li>Declared with <code>transition</code> keyword</li>
          <li>Can have <code>public</code> or <code>private</code> inputs</li>
          <li>Inputs are private by default</li>
          <li>Can return values and records</li>
        </ul>
        <p className="mt-4">
          <strong>Visibility matters:</strong>
        </p>
        <ul className="mt-2">
          <li><code>public</code> — visible on the blockchain</li>
          <li><code>private</code> — hidden, only the proof is public</li>
        </ul>
      </>
    ),
    code: `program transitions.aleo {
    // This shows the syntax for public/private inputs
    // In practice, you'd call with actual inputs
    
    transition main() -> u32 {
        // Demonstrates public vs private concept
        let visible: u32 = 10u32;  // would be public
        let hidden: u32 = 5u32;    // would be private
        
        let result: u32 = visible + hidden;
        return result;
    }
}`,
  },
  {
    title: 'Helper Functions',
    content: (
      <>
        <p>
          <strong>Helper functions</strong> (declared with <code>function</code>) are internal functions 
          that cannot be called directly from outside the program.
        </p>
        <p className="mt-4">
          <strong>Use cases:</strong>
        </p>
        <ul className="mt-2">
          <li>Reusable computation logic</li>
          <li>Breaking down complex transitions</li>
          <li>Code organization</li>
        </ul>
        <p className="mt-4">
          <strong>Restrictions:</strong>
        </p>
        <ul className="mt-2">
          <li>Cannot produce records</li>
          <li>No visibility modifiers on inputs</li>
          <li>Can only call inline functions</li>
        </ul>
      </>
    ),
    code: `program helpers.aleo {
    // Helper function (internal only)
    function add_numbers(a: u32, b: u32) -> u32 {
        return a + b;
    }
    
    // Transition calls helper function
    transition main() -> u32 {
        let x: u32 = 5u32;
        let y: u32 = 3u32;
        
        let sum: u32 = add_numbers(x, y);
        return sum;
    }
}`,
  },
  {
    title: 'Inline Functions',
    content: (
      <>
        <p>
          <strong>Inline functions</strong> are expanded at each call site during compilation, 
          similar to macros in other languages.
        </p>
        <p className="mt-4">
          <strong>Benefits:</strong>
        </p>
        <ul className="mt-2">
          <li>No function call overhead</li>
          <li>Can be called by both transitions and helper functions</li>
          <li>Good for small, frequently used computations</li>
        </ul>
        <p className="mt-4">
          <strong>Function call hierarchy:</strong>
        </p>
        <ul className="mt-2">
          <li><code>transition</code> → can call: function, inline</li>
          <li><code>function</code> → can call: inline only</li>
          <li><code>inline</code> → can call: other inlines only</li>
        </ul>
      </>
    ),
    code: `program inlines.aleo {
    // Inline function - expanded at call site
    inline square(n: u32) -> u32 {
        return n * n;
    }
    
    inline cube(n: u32) -> u32 {
        return n * square(n);
    }
    
    transition main() -> u32 {
        let x: u32 = 4u32;
        
        let squared: u32 = square(x);
        let cubed: u32 = cube(x);
        return squared + cubed;
    }
}`,
  },
  // ==================== SECTION 7: RECORDS ====================
  {
    title: 'Records: Private State',
    content: (
      <>
        <p>
          <strong>Records</strong> are Leo's mechanism for encoding <strong>private state</strong> on Aleo.
          They're similar to UTXOs in Bitcoin — owned, consumed, and created.
        </p>
        <p className="mt-4">
          <strong>Key properties:</strong>
        </p>
        <ul className="mt-2">
          <li>Must have an <code>owner: address</code> field</li>
          <li>Fields can be <code>public</code>, <code>private</code>, or <code>constant</code></li>
          <li>Private by default</li>
          <li>Perfect for tokens, NFTs, and private data</li>
        </ul>
        <p className="mt-4">
          <strong>Coming from Solidity?</strong> Records are like structs that only the owner can access and modify.
        </p>
      </>
    ),
    code: `program records.aleo {
    record Token {
        owner: address,
        amount: u64,
    }
    
    transition mint() -> Token {
        // Create a new token record
        // The caller becomes the owner
        let token: Token = Token {
            owner: self.caller,
            amount: 1000u64,
        };
        return token;
    }
}`,
  },
  {
    title: 'Record Visibility',
    content: (
      <>
        <p>
          Record fields can have different <strong>visibility levels</strong>, controlling what's public on-chain.
        </p>
        <p className="mt-4">
          <strong>Visibility modifiers:</strong>
        </p>
        <ul className="mt-2">
          <li><code>private</code> (default) — encrypted, only owner can see</li>
          <li><code>public</code> — visible on the blockchain</li>
          <li><code>constant</code> — fixed value, visible to all</li>
        </ul>
        <p className="mt-4">
          This allows fine-grained control over privacy — you can have a public token balance 
          with a private transaction history.
        </p>
      </>
    ),
    code: `program visibility.aleo {
    record Certificate {
        // Always required
        owner: address,
        
        // Encrypted - only owner sees
        private secret_data: u64,
        
        // Visible on blockchain
        public issued_date: u32,
        
        // Fixed, visible constant
        constant version: u8,
    }
    
    transition issue() -> Certificate {
        return Certificate {
            owner: self.caller,
            secret_data: 12345u64,
            issued_date: 20260116u32,
            version: 1u8,
        };
    }
}`,
  },
  // ==================== SECTION 8: CONSTANTS ====================
  {
    title: 'Constants',
    content: (
      <>
        <p>
          <strong>Constants</strong> are immutable values declared with the <code>const</code> keyword. 
          They're evaluated at compile time.
        </p>
        <p className="mt-4">
          <strong>Two scopes for constants:</strong>
        </p>
        <ul className="mt-2">
          <li><strong>Global</strong> — defined at program level, accessible everywhere</li>
          <li><strong>Local</strong> — defined inside functions, scoped to that function</li>
        </ul>
        <p className="mt-4">
          <strong>Best practices:</strong>
        </p>
        <ul className="mt-2">
          <li>Use UPPER_SNAKE_CASE for constant names</li>
          <li>Define magic numbers as constants</li>
          <li>Great for configuration values</li>
        </ul>
      </>
    ),
    code: `program constants.aleo {
    // Global constants
    const MAX_SUPPLY: u64 = 1_000_000u64;
    const FEE_PERCENT: u8 = 5u8;
    
    transition main() -> u64 {
        // Local constant
        const MULTIPLIER: u64 = 100u64;
        
        let amount: u64 = 500u64;
        
        // Use constants in calculations
        let fee: u64 = amount * FEE_PERCENT as u64 / MULTIPLIER;
        
        return fee;
    }
}`,
  },
  // ==================== SECTION 9: MAPPINGS ====================
  {
    title: 'Mappings: Public State',
    content: (
      <>
        <p>
          <strong>Mappings</strong> are key-value stores for <strong>public on-chain state</strong>. 
          They're similar to mappings in Solidity.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>mapping name: key_type =&gt; value_type;</code>
        </p>
        <p className="mt-4">
          <strong>Key characteristics:</strong>
        </p>
        <ul className="mt-2">
          <li>Stored publicly on the blockchain</li>
          <li>Can only be modified in <code>async</code> functions</li>
          <li>Perfect for account balances, counters, registries</li>
        </ul>
        <p className="mt-4 text-yellow-400">
          ⚠️ Mapping operations require async transitions (covered in the next lesson).
        </p>
      </>
    ),
    code: `program mappings.aleo {
    // Public mapping: address -> balance
    mapping balances: address => u64;
    
    // Note: To modify mappings, you need
    // async transitions and async functions.
    // We'll cover this in the next lesson!
    
    transition check_balance() -> u64 {
        // This transition doesn't modify state
        // Just demonstrates mapping declaration
        return 0u64;
    }
}`,
  },
  {
    title: 'Async Functions',
    content: (
      <>
        <p>
          <strong>Async functions</strong> execute on-chain and can modify public state (mappings).
          They return a <code>Future</code> that's executed after proof verification.
        </p>
        <p className="mt-4">
          <strong>How it works:</strong>
        </p>
        <ol className="mt-2 list-decimal list-inside">
          <li>Declare transition as <code>async transition</code></li>
          <li>Return a <code>Future</code> from <code>async function</code></li>
          <li>The async function runs on-chain after proof verification</li>
        </ol>
        <p className="mt-4">
          <strong>Mapping operations:</strong>
        </p>
        <ul className="mt-2">
          <li><code>Mapping::get(map, key)</code> — get value (fails if not exists)</li>
          <li><code>Mapping::get_or_use(map, key, default)</code> — get with fallback</li>
          <li><code>Mapping::set(map, key, value)</code> — set value</li>
          <li><code>Mapping::contains(map, key)</code> — check if key exists</li>
        </ul>
      </>
    ),
    code: `program async_example.aleo {
    mapping counter: address => u64;
    
    async transition increment() -> Future {
        // Return future for on-chain execution
        return finalize_increment(self.caller);
    }
    
    async function finalize_increment(caller: address) {
        // Get current value (0 if not exists)
        let current: u64 = Mapping::get_or_use(
            counter,
            caller,
            0u64
        );
        
        // Update the mapping
        Mapping::set(counter, caller, current + 1u64);
    }
}`,
  },
  // ==================== EXERCISE 1 ====================
  {
    title: '📝 Exercise: Simple Calculator',
    content: (
      <>
        <p>
          <strong>Time to practice!</strong> Create a simple calculator program.
        </p>
        <p className="mt-4">
          <strong>Requirements:</strong>
        </p>
        <ol className="mt-2 list-decimal list-inside">
          <li>Create a struct called <code>Result</code> with fields: <code>sum</code>, <code>difference</code>, <code>product</code></li>
          <li>Write a transition <code>calculate</code> that takes two <code>u32</code> inputs</li>
          <li>Return a <code>Result</code> struct with all three calculations</li>
        </ol>
        <p className="mt-4">
          <strong>Starter code is provided.</strong> Fill in the missing parts!
        </p>
        <p className="mt-4 text-green-400">
          💡 Hint: Use the struct syntax from the Structs lesson.
        </p>
      </>
    ),
    code: `program calculator.aleo {
    // TODO: Define a Result struct with:
    // - sum: u32
    // - difference: u32
    // - product: u32
    
    struct Result {
        // Add fields here
    }
    
    transition calculate(a: u32, b: u32) -> Result {
        // TODO: Create and return a Result
        // with sum, difference, and product
        
        return Result {
            // Fill in the calculations
        };
    }
}`,
  },
  // ==================== SECTION 10: ADVANCED RECORDS ====================
  {
    title: 'Token Transfer Pattern',
    content: (
      <>
        <p>
          The most common pattern in Leo is <strong>private token transfers</strong>. 
          This demonstrates consuming and creating records.
        </p>
        <p className="mt-4">
          <strong>The pattern:</strong>
        </p>
        <ol className="mt-2 list-decimal list-inside">
          <li>Take an existing record as input (consumed)</li>
          <li>Perform the transfer logic</li>
          <li>Return new records for sender and receiver</li>
        </ol>
        <p className="mt-4">
          <strong>Key insight:</strong> Records are like cash — when you spend a $20 bill, 
          it's destroyed and new bills are created as change.
        </p>
      </>
    ),
    code: `program token.aleo {
    record Token {
        owner: address,
        amount: u64,
    }
    
    // Mint tokens to the caller
    transition mint() -> Token {
        return Token {
            owner: self.caller,
            amount: 1000u64,
        };
    }
    
    // Example showing transfer pattern
    // In practice, you'd pass in a Token record
    transition example_transfer() -> u64 {
        // This demonstrates the concept:
        // 1. Input token is consumed
        // 2. New tokens created for sender/receiver
        // 3. Balances must add up
        
        let original: u64 = 1000u64;
        let transfer_amount: u64 = 300u64;
        let remaining: u64 = original - transfer_amount;
        
        return remaining;  // 700
    }
}`,
  },
  // ==================== SECTION 11: IMPORTS ====================
  {
    title: 'Imports & Dependencies',
    content: (
      <>
        <p>
          Leo programs can import and use other deployed programs. 
          This enables <strong>composability</strong> — building on existing code.
        </p>
        <p className="mt-4">
          <strong>Import syntax:</strong>
        </p>
        <pre className="mt-2 p-2 bg-neutral-800 rounded text-sm">
{`import credits.aleo;

program my_program.aleo {
    // Use imported program
}`}
        </pre>
        <p className="mt-4">
          <strong>Common imports:</strong>
        </p>
        <ul className="mt-2">
          <li><code>credits.aleo</code> — Aleo's native token program</li>
          <li>Custom deployed programs</li>
        </ul>
        <p className="mt-4">
          Imports must be declared outside the program scope, at the top of the file.
        </p>
      </>
    ),
    code: `// Imports go outside program scope
// import credits.aleo;

program imports.aleo {
    // After importing, you can:
    // 1. Call external transitions
    // 2. Use their struct types
    // 3. Query their mappings (read-only)
    
    transition main() -> u64 {
        // Example: calling credits.aleo
        // let balance: u64 = credits.aleo/
        //     account.get_or_use(addr, 0u64);
        
        return 100u64;
    }
}`,
  },
  // ==================== SECTION 12: ASSERTIONS ====================
  {
    title: 'Assertions',
    content: (
      <>
        <p>
          <strong>Assertions</strong> validate conditions at runtime. If an assertion fails, 
          the entire transaction is reverted.
        </p>
        <p className="mt-4">
          <strong>Assert functions:</strong>
        </p>
        <ul className="mt-2">
          <li><code>assert(condition)</code> — fails if condition is false</li>
          <li><code>assert_eq(a, b)</code> — fails if a ≠ b</li>
          <li><code>assert_neq(a, b)</code> — fails if a = b</li>
        </ul>
        <p className="mt-4">
          <strong>Use cases:</strong>
        </p>
        <ul className="mt-2">
          <li>Access control checks</li>
          <li>Balance validation</li>
          <li>Input validation</li>
        </ul>
      </>
    ),
    code: `program assertions.aleo {
    transition main() -> u64 {
        let amount: u64 = 100u64;
        let balance: u64 = 500u64;
        
        // Ensure sufficient balance
        assert(balance >= amount);
        
        // Ensure amount is positive
        assert_neq(amount, 0u64);
        
        // Equality check
        let expected: u64 = 400u64;
        let result: u64 = balance - amount;
        assert_eq(result, expected);
        
        return result;
    }
}`,
  },
  // ==================== EXERCISE 2 ====================
  {
    title: '📝 Exercise: Voting System',
    content: (
      <>
        <p>
          <strong>Build a simple voting system!</strong>
        </p>
        <p className="mt-4">
          <strong>Requirements:</strong>
        </p>
        <ol className="mt-2 list-decimal list-inside">
          <li>Create a <code>Ballot</code> record with <code>owner</code> and <code>has_voted: bool</code></li>
          <li>Write a <code>vote</code> transition that:
            <ul className="ml-4 mt-1">
              <li>Takes a Ballot and a candidate (u8)</li>
              <li>Asserts the ballot hasn't been used</li>
              <li>Returns a "used" ballot</li>
            </ul>
          </li>
        </ol>
        <p className="mt-4 text-green-400">
          💡 Hint: Use <code>assert</code> to check <code>has_voted</code> is false.
        </p>
      </>
    ),
    code: `program voting.aleo {
    record Ballot {
        owner: address,
        has_voted: bool,
    }
    
    // TODO: Issue a fresh ballot
    transition issue_ballot(to: address) -> Ballot {
        return Ballot {
            owner: to,
            has_voted: false,
        };
    }
    
    // TODO: Cast a vote
    // - Take a Ballot and candidate: u8
    // - Assert ballot hasn't been used
    // - Return a used ballot
    transition vote(
        ballot: Ballot,
        candidate: u8
    ) -> Ballot {
        // Add your code here
        
        return Ballot {
            owner: ballot.owner,
            has_voted: true,
        };
    }
}`,
  },
  // ==================== SECTION 13: HASHING ====================
  {
    title: 'Hash Functions',
    content: (
      <>
        <p>
          Leo provides several cryptographic <strong>hash functions</strong> for creating 
          deterministic, fixed-size outputs from arbitrary inputs.
        </p>
        <p className="mt-4">
          <strong>Available hash functions:</strong>
        </p>
        <ul className="mt-2">
          <li><code>BHP256</code>, <code>BHP512</code>, <code>BHP768</code>, <code>BHP1024</code></li>
          <li><code>Pedersen64</code>, <code>Pedersen128</code></li>
          <li><code>Poseidon2</code>, <code>Poseidon4</code>, <code>Poseidon8</code></li>
          <li><code>SHA3_256</code>, <code>SHA3_384</code>, <code>SHA3_512</code></li>
          <li><code>Keccak256</code>, <code>Keccak384</code>, <code>Keccak512</code></li>
        </ul>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>HashFunction::hash_to_TYPE(input)</code>
        </p>
      </>
    ),
    code: `program hashing.aleo {
    transition main() -> field {
        let input: field = 123field;
        
        // Poseidon hash (ZK-friendly)
        let hash1: field = Poseidon2::hash_to_field(input);
        
        // BHP hash
        let hash2: field = BHP256::hash_to_field(input);
        
        return hash1;
    }
}`,
  },
  {
    title: 'Commitments',
    content: (
      <>
        <p>
          <strong>Commitments</strong> are a wrapper around hash functions that add a <strong>blinding factor (salt)</strong>.
          This allows you to commit to a value without revealing it.
        </p>
        <p className="mt-4">
          <strong>Why use commitments?</strong>
        </p>
        <ul className="mt-2">
          <li>Commit to a value multiple times without revealing you did</li>
          <li>Hide the relationship between commitments</li>
          <li>Useful for voting, auctions, and sealed-bid systems</li>
        </ul>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>HashFunction::commit_to_TYPE(value, salt)</code>
        </p>
        <p className="mt-4">
          The salt should be a random <code>scalar</code> value.
        </p>
      </>
    ),
    code: `program commitments.aleo {
    transition main() -> field {
        let secret: field = 42field;
        
        // Use a fixed salt for demo
        // In real apps, use ChaCha::rand_scalar()
        // in async functions
        let salt: scalar = 123scalar;
        
        // Create a commitment (hides the secret)
        let commitment: field = BHP256::commit_to_field(
            secret,
            salt
        );
        
        // Same secret + different salt = different commitment
        let salt2: scalar = 456scalar;
        let commitment2: field = BHP256::commit_to_field(
            secret,
            salt2
        );
        
        return commitment;
    }
}`,
  },
  {
    title: 'Random Numbers',
    content: (
      <>
        <p>
          Leo provides <strong>ChaCha</strong> for generating random values. 
          This is essential for cryptographic operations.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>ChaCha::rand_TYPE()</code>
        </p>
        <p className="mt-4">
          <strong>Available random generators:</strong>
        </p>
        <ul className="mt-2">
          <li><code>ChaCha::rand_bool()</code></li>
          <li><code>ChaCha::rand_u8()</code> through <code>rand_u128()</code></li>
          <li><code>ChaCha::rand_i8()</code> through <code>rand_i128()</code></li>
          <li><code>ChaCha::rand_field()</code></li>
          <li><code>ChaCha::rand_scalar()</code></li>
          <li><code>ChaCha::rand_address()</code></li>
        </ul>
      </>
    ),
    code: `program randomness.aleo {
    // ChaCha random functions only work in
    // async functions (on-chain execution)
    
    mapping random_values: u8 => u64;
    
    async transition generate() -> Future {
        return finalize_generate();
    }
    
    async function finalize_generate() {
        // Generate random values on-chain
        let rand_num: u64 = ChaCha::rand_u64();
        
        // Store it
        Mapping::set(random_values, 1u8, rand_num);
    }
    
    // For off-chain, use constants or inputs
    transition main() -> u64 {
        // Demo without randomness
        let value: u64 = 42u64;
        return value;
    }
}`,
  },
  {
    title: 'Block Context',
    content: (
      <>
        <p>
          Leo programs can access <strong>blockchain context</strong> information 
          about the current block.
        </p>
        <p className="mt-4">
          <strong>Available context:</strong>
        </p>
        <ul className="mt-2">
          <li><code>block.height</code> — current block number (u32)</li>
        </ul>
        <p className="mt-4">
          <strong>Use cases:</strong>
        </p>
        <ul className="mt-2">
          <li>Time-locked transactions</li>
          <li>Deadline enforcement</li>
          <li>Epoch-based logic</li>
        </ul>
        <p className="mt-4 text-yellow-400">
          ⚠️ Block context is only available during on-chain execution.
        </p>
      </>
    ),
    code: `program block_context.aleo {
    // Note: block.height is only available
    // in async functions (on-chain)
    
    mapping heights: u8 => u32;
    
    async transition record_height() -> Future {
        return finalize_record();
    }
    
    async function finalize_record() {
        // Get current block height
        let height: u32 = block.height;
        
        // Store the height
        Mapping::set(heights, 1u8, height);
    }
    
    // Simple transition for demo
    transition main() -> u32 {
        return 100u32;
    }
}`,
  },
  {
    title: 'Self Properties',
    content: (
      <>
        <p>
          The <code>self</code> keyword provides access to <strong>program and transaction context</strong>.
        </p>
        <p className="mt-4">
          <strong>Available properties:</strong>
        </p>
        <ul className="mt-2">
          <li><code>self.caller</code> — who called this transition</li>
          <li><code>self.signer</code> — who signed the transaction</li>
          <li><code>self.address</code> — this program's address</li>
          <li><code>self.program_owner</code> — who deployed this program</li>
        </ul>
        <p className="mt-4">
          <strong>caller vs signer:</strong>
        </p>
        <ul className="mt-2">
          <li><code>caller</code> — can be a user OR another program</li>
          <li><code>signer</code> — always the original user</li>
        </ul>
      </>
    ),
    code: `program self_props.aleo {
    transition main() -> address {
        // Who called this transition
        let caller: address = self.caller;
        
        // Who signed the transaction (origin)
        let signer: address = self.signer;
        
        // This program's address
        let prog_addr: address = self.address;
        
        return caller;
    }
}`,
  },
  // ==================== SECTION 14: TYPE CASTING ====================
  {
    title: 'Type Casting',
    content: (
      <>
        <p>
          Leo requires explicit type conversions using the <code>as</code> keyword. 
          There are no implicit conversions.
        </p>
        <p className="mt-4">
          <strong>Syntax:</strong> <code>value as target_type</code>
        </p>
        <p className="mt-4">
          <strong>Common conversions:</strong>
        </p>
        <ul className="mt-2">
          <li>Between integer types: <code>x as u64</code></li>
          <li>To field: <code>x as field</code></li>
          <li>To address: <code>x as address</code></li>
        </ul>
        <p className="mt-4 text-yellow-400">
          ⚠️ Be careful with downcasting — data may be truncated!
        </p>
      </>
    ),
    code: `program casting.aleo {
    transition main() -> u64 {
        let small: u8 = 255u8;
        let medium: u32 = 1000u32;
        
        // Upcast (safe)
        let bigger: u64 = small as u64;
        let also_big: u64 = medium as u64;
        
        // Cast to field
        let f: field = medium as field;
        
        return bigger + also_big;
    }
}`,
  },
  // ==================== FINAL EXERCISE ====================
  {
    title: '📝 Exercise: Private Auction',
    content: (
      <>
        <p>
          <strong>Final challenge!</strong> Build a private auction system.
        </p>
        <p className="mt-4">
          <strong>Requirements:</strong>
        </p>
        <ol className="mt-2 list-decimal list-inside">
          <li>Create a <code>Bid</code> record with <code>owner</code>, <code>amount: u64</code>, <code>item_id: field</code></li>
          <li>Write <code>place_bid</code> that creates a Bid</li>
          <li>Write <code>reveal_winner</code> that takes two Bids and returns the higher one</li>
        </ol>
        <p className="mt-4 text-green-400">
          💡 This combines records, assertions, and ternary expressions!
        </p>
      </>
    ),
    code: `program auction.aleo {
    record Bid {
        owner: address,
        amount: u64,
        item_id: field,
    }
    
    transition place_bid(
        amount: u64,
        item_id: field
    ) -> Bid {
        return Bid {
            owner: self.caller,
            amount: amount,
            item_id: item_id,
        };
    }
    
    // TODO: Compare two bids, return the winner
    transition reveal_winner(
        bid1: Bid,
        bid2: Bid
    ) -> Bid {
        // Ensure same item
        assert_eq(bid1.item_id, bid2.item_id);
        
        // Return higher bid
        // Hint: Use ternary expression
        return bid1.amount > bid2.amount ? bid1 : bid2;
    }
}`,
  },
  // ==================== CONCLUSION ====================
  {
    title: 'Congratulations! 🎉',
    content: (
      <>
        <p>
          <strong>You've completed Exploring Leo!</strong>
        </p>
        <p className="mt-4">
          You've learned the fundamentals of Leo programming:
        </p>
        <ul className="mt-2">
          <li>✅ Data types and operators</li>
          <li>✅ Control flow and functions</li>
          <li>✅ Structs and records</li>
          <li>✅ Mappings and async functions</li>
          <li>✅ Privacy patterns and assertions</li>
        </ul>
        <p className="mt-4">
          <strong>What's next?</strong>
        </p>
        <ul className="mt-2">
          <li>📚 Read the <a href="https://docs.leo-lang.org" target="_blank" rel="noopener" className="text-[#00ffc8] hover:underline">official Leo documentation</a></li>
          <li>🛠️ Install the <a href="https://docs.leo-lang.org/getting_started/installation" target="_blank" rel="noopener" className="text-[#00ffc8] hover:underline">Leo CLI</a> and build locally</li>
          <li>🚀 Deploy your first program to the Aleo testnet</li>
          <li>💬 Join the <a href="https://discord.gg/aleo" target="_blank" rel="noopener" className="text-[#00ffc8] hover:underline">Aleo Discord</a> community</li>
        </ul>
        <p className="mt-4">
          Happy building! 🚀
        </p>
      </>
    ),
    code: `// You're ready to build on Aleo!
// 
// Try creating your own program:
// - A token with mint/transfer
// - A private voting system  
// - A ZK game like battleship
//
// The possibilities are endless!

program graduation.aleo {
    transition celebrate() -> field {
        return 2025field;
    }
}`,
  },
];

// Export lessons for Header navigation
export { lessons };

function App() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [code, setCode] = useState(lessons[0].code);
  const { execute, isExecuting, result, error, clearResult } = useLeoExecutor();

  const handleLessonChange = useCallback((index: number) => {
    setCurrentLesson(index);
    setCode(lessons[index].code);
    clearResult();
  }, [clearResult]);

  const handlePrevious = useCallback(() => {
    if (currentLesson > 0) {
      handleLessonChange(currentLesson - 1);
    }
  }, [currentLesson, handleLessonChange]);

  const handleNext = useCallback(() => {
    if (currentLesson < lessons.length - 1) {
      handleLessonChange(currentLesson + 1);
    }
  }, [currentLesson, handleLessonChange]);

  const handleRun = useCallback(async () => {
    await execute(code);
  }, [code, execute]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const lesson = lessons[currentLesson];

  return (
    <div className="h-screen flex flex-col bg-black">
      <Header 
        lessons={lessons}
        currentLesson={currentLesson}
        onNavigate={handleLessonChange}
      />
      
      <main className="flex-1 flex min-h-0">
        {/* Left Panel - Content */}
        <div className="w-1/2 border-r border-neutral-800">
          <ContentPanel
            title={lesson.title}
            content={lesson.content}
            currentIndex={currentLesson + 1}
            totalLessons={lessons.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>

        {/* Right Panel - Editor & Output */}
        <div className="w-1/2 flex flex-col">
          {/* Code Editor */}
          <div className="flex-2 flex flex-col min-h-0 border-b border-neutral-800">
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Editor
              </span>
              <RunButton
                onClick={handleRun}
                isLoading={isExecuting}
                disabled={!code.trim()}
              />
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                onRun={handleRun}
                height="100%"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex-1 min-h-37.5">
            <OutputPanel
              result={result}
              error={error}
              isLoading={isExecuting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
