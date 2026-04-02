/* ============================================================
   TypeScript Roadmap — app.js
   Handles: search, progress, sections, sidebar, theme, etc.
   ============================================================ */

(function() {
  'use strict';

  /* ── State ─────────────────────────────────────────────── */
  const STORAGE_KEY = 'ts-roadmap-progress';
  let completed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let currentView = 'main'; // 'main' | 'timeline'

  /* ── DOM refs ──────────────────────────────────────────── */
  const loader        = document.getElementById('loader');
  const sidebar       = document.getElementById('sidebar');
  const mainEl        = document.getElementById('main');
  const searchInput   = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const backTop       = document.getElementById('back-top');
  const overlay       = document.getElementById('overlay');
  const hamburger     = document.getElementById('hamburger');
  const themeToggle   = document.getElementById('theme-toggle');
  const timelineBtn   = document.getElementById('timeline-btn');
  const mainView      = document.getElementById('main-view');
  const timelineView  = document.getElementById('timeline-view');
  const globalPct     = document.getElementById('global-pct');
  const sidebarFill   = document.getElementById('sidebar-fill');
  const sidebarPct    = document.getElementById('sidebar-pct');

  /* ── Section Metadata ──────────────────────────────────── */
  const sections = [
    { id:'s01', num:'01', title:'Prerequisites', icon:'fa-brands fa-js', color:'ico-yellow',
      tags:['JavaScript','ES6','Async/Await'],
      summary:'JavaScript fundamentals and ES6+ features needed before TypeScript.',
      keywords:'javascript es6 promises arrow functions destructuring modules' },
    { id:'s02', num:'02', title:'TypeScript Basics', icon:'fa-solid fa-code', color:'ico-blue',
      tags:['Types','Variables','Primitives'],
      summary:'Core TypeScript syntax, basic types, and the type system fundamentals.',
      keywords:'typescript basics types string number boolean any unknown never' },
    { id:'s03', num:'03', title:'Functions & Type Annotations', icon:'fa-solid fa-function', color:'ico-purple',
      tags:['Functions','Parameters','Return Types'],
      summary:'Typing function parameters, return values, optional and rest parameters.',
      keywords:'function parameters return types optional rest overloading' },
    { id:'s04', num:'04', title:'Arrays, Tuples & Enums', icon:'fa-solid fa-list', color:'ico-green',
      tags:['Array','Tuple','Enum'],
      summary:'Typed arrays, fixed-length tuples, and named enum constants.',
      keywords:'array tuple enum const enum readonly' },
    { id:'s05', num:'05', title:'Objects & Type Aliases', icon:'fa-solid fa-cube', color:'ico-orange',
      tags:['Objects','Type Alias','Readonly'],
      summary:'Defining object shapes with type aliases and optional properties.',
      keywords:'object type alias readonly optional nested' },
    { id:'s06', num:'06', title:'Interfaces', icon:'fa-solid fa-shapes', color:'ico-teal',
      tags:['Interface','Extends','Implements'],
      summary:'Interfaces for object contracts, extension, and class implementation.',
      keywords:'interface extends implements declaration merging' },
    { id:'s07', num:'07', title:'Advanced Types', icon:'fa-solid fa-diagram-project', color:'ico-pink',
      tags:['Union','Intersection','Literal'],
      summary:'Union, intersection, and literal types for flexible type composition.',
      keywords:'union intersection literal discriminated narrow' },
    { id:'s08', num:'08', title:'Type Assertions & Guards', icon:'fa-solid fa-shield-halved', color:'ico-red',
      tags:['as','instanceof','typeof'],
      summary:'Narrowing types at runtime with guards and assertions.',
      keywords:'type assertion as instanceof typeof narrowing predicate' },
    { id:'s09', num:'09', title:'Classes & OOP', icon:'fa-solid fa-sitemap', color:'ico-blue',
      tags:['Class','Inheritance','Access Modifiers'],
      summary:'Object-oriented programming with TypeScript classes.',
      keywords:'class extends abstract implements private public protected access' },
    { id:'s10', num:'10', title:'Generics', icon:'fa-solid fa-brackets-curly', color:'ico-purple',
      tags:['Generic','Constraints','Utility'],
      summary:'Write reusable, type-safe generic functions and data structures.',
      keywords:'generic constraints extends keyof infer conditional' },
    { id:'s11', num:'11', title:'Modules & Namespaces', icon:'fa-solid fa-boxes-stacked', color:'ico-green',
      tags:['import','export','namespace'],
      summary:'ES modules, barrel exports, and TypeScript namespaces.',
      keywords:'module import export namespace ambient declaration file' },
    { id:'s12', num:'12', title:'DOM Handling', icon:'fa-solid fa-window-restore', color:'ico-yellow',
      tags:['DOM','Events','Selectors'],
      summary:'Typing DOM elements, events, and browser APIs in TypeScript.',
      keywords:'dom document queryselector htmlelement event listener' },
    { id:'s13', num:'13', title:'TypeScript with Node.js', icon:'fa-brands fa-node-js', color:'ico-green',
      tags:['Node.js','@types','fs','http'],
      summary:'Backend development with Node.js and @types/node.',
      keywords:'nodejs types node fs http express path process' },
    { id:'s14', num:'14', title:'TypeScript with Express', icon:'fa-solid fa-server', color:'ico-orange',
      tags:['Express','Middleware','Router'],
      summary:'REST APIs with Express, typed requests, responses, and middleware.',
      keywords:'express router middleware request response typed api' },
    { id:'s15', num:'15', title:'TypeScript with React', icon:'fa-brands fa-react', color:'ico-blue',
      tags:['React','JSX','Hooks','Props'],
      summary:'Typed React components, hooks, props, and context.',
      keywords:'react props state hooks context jsx tsx component' },
    { id:'s16', num:'16', title:'Utility Types', icon:'fa-solid fa-toolbox', color:'ico-teal',
      tags:['Partial','Readonly','Pick','Record'],
      summary:'Built-in TypeScript utility types to transform and compose types.',
      keywords:'partial required readonly pick omit record exclude extract' },
    { id:'s17', num:'17', title:'Advanced TypeScript', icon:'fa-solid fa-wand-magic-sparkles', color:'ico-purple',
      tags:['Conditional','Mapped','Infer'],
      summary:'Conditional types, mapped types, template literals, and infer keyword.',
      keywords:'conditional mapped infer template literal distributive' },
    { id:'s18', num:'18', title:'tsconfig & Compiler', icon:'fa-solid fa-gears', color:'ico-red',
      tags:['tsconfig','strict','target'],
      summary:'Configure TypeScript compiler options for different environments.',
      keywords:'tsconfig strict target module paths outdir rootdir' },
    { id:'s19', num:'19', title:'Testing with TypeScript', icon:'fa-solid fa-flask', color:'ico-green',
      tags:['Jest','Vitest','Testing'],
      summary:'Unit, integration, and E2E testing with typed test utilities.',
      keywords:'jest vitest testing mock spy describe it expect' },
    { id:'s20', num:'20', title:'Real-world Projects', icon:'fa-solid fa-rocket', color:'ico-orange',
      tags:['Projects','Patterns','Architecture'],
      summary:'Build full-stack projects with TypeScript best practices.',
      keywords:'project fullstack architecture patterns api frontend' },
    { id:'s21', num:'21', title:'Interview Preparation', icon:'fa-solid fa-briefcase', color:'ico-pink',
      tags:['Interview','Questions','Tips'],
      summary:'Common TypeScript interview questions and preparation strategies.',
      keywords:'interview questions tips hiring senior junior' },
  ];

  /* ── Detailed Content for each section ─────────────────── */
  const sectionContent = {
    s01: {
      explain: `Before diving into TypeScript, you need a solid grasp of modern JavaScript (ES2015+). TypeScript is a superset of JavaScript, so everything you know in JS applies here. Focus on: variable declarations with <code>let</code> and <code>const</code>, arrow functions, destructuring, the spread operator, modules, and async/await.`,
      concepts: ['let / const vs var (block scoping)', 'Arrow functions and lexical this', 'Destructuring (array and object)', 'Spread / rest operators', 'Template literals', 'ES Modules (import / export)', 'Promises and async/await', 'Array methods: map, filter, reduce', 'Optional chaining (?.) and nullish coalescing (??)'],
      code: `<span class="cm">// Arrow functions</span>
<span class="kw">const</span> <span class="fn">add</span> = (<span class="nm">a</span>: <span class="ty">number</span>, <span class="nm">b</span>: <span class="ty">number</span>) => <span class="nm">a</span> + <span class="nm">b</span>;

<span class="cm">// Destructuring</span>
<span class="kw">const</span> { name, age = <span class="nm">25</span> } = user;
<span class="kw">const</span> [first, ...rest] = items;

<span class="cm">// Async / Await</span>
<span class="kw">async function</span> <span class="fn">fetchUser</span>(id: <span class="ty">string</span>) {
  <span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="st">\`/api/users/\${id}\`</span>);
  <span class="kw">return</span> res.json();
}

<span class="cm">// Optional chaining</span>
<span class="kw">const</span> city = user?.address?.city ?? <span class="st">'Unknown'</span>;`,
      useCases: ['Fetching data from APIs with async/await', 'Transforming arrays with map/filter/reduce', 'Importing utility libraries with ES Modules'],
      mistakes: ['Using var instead of let/const (hoisting issues)', 'Forgetting to await async functions', 'Mutating function parameters directly'],
      qa: [
        { q: 'What is the difference between let, const, and var?', a: 'var is function-scoped and hoisted. let and const are block-scoped and not hoisted in the same way. const prevents reassignment but not mutation of objects/arrays.' },
        { q: 'What does optional chaining (?.) do?', a: 'It short-circuits evaluation if the left-hand side is null or undefined, returning undefined instead of throwing a TypeError. E.g., user?.profile?.avatar returns undefined if user or profile is null.' },
        { q: 'How does async/await differ from .then()/.catch()?', a: 'Both handle Promises. async/await is syntactic sugar that makes async code look synchronous, improving readability. .then()/.catch() uses chaining. Both are equivalent under the hood.' },
        { q: 'What is destructuring and when would you use it?', a: 'Destructuring extracts values from arrays or properties from objects into distinct variables. Use it to simplify code when you need multiple properties: const { x, y } = point; instead of const x = point.x;' },
        { q: 'Explain the spread operator vs rest parameters.', a: 'Spread (...arr) expands an iterable into individual elements (e.g., in function calls or array literals). Rest parameters (...args) collect multiple function arguments into an array.' },
      ]
    },
    s02: {
      explain: `TypeScript adds a type system on top of JavaScript. Every value has a type — the TypeScript compiler infers types when possible, and you annotate explicitly when needed. The key primitive types are <code>string</code>, <code>number</code>, <code>boolean</code>. Special types include <code>any</code> (escape hatch), <code>unknown</code> (safer any), <code>never</code> (unreachable), <code>void</code> (no return value), and <code>null</code>/<code>undefined</code>.`,
      concepts: ['Type inference (compiler guesses type)', 'Explicit annotations with : Type', 'Primitive types: string, number, boolean', 'Special types: any, unknown, never, void', 'null and undefined', 'Type narrowing with typeof', 'Strict null checks'],
      code: `<span class="cm">// Inference — TypeScript knows this is number</span>
<span class="kw">let</span> score = <span class="nm">42</span>;          <span class="cm">// inferred: number</span>
<span class="kw">let</span> name: <span class="ty">string</span> = <span class="st">"Alice"</span>;

<span class="cm">// any vs unknown</span>
<span class="kw">let</span> data: <span class="ty">any</span> = <span class="nm">42</span>;
data.toUpperCase();     <span class="cm">// no error — dangerous!</span>

<span class="kw">let</span> safe: <span class="ty">unknown</span> = <span class="nm">42</span>;
<span class="kw">if</span> (<span class="kw">typeof</span> safe === <span class="st">"string"</span>) {
  safe.toUpperCase();   <span class="cm">// OK — narrowed first</span>
}

<span class="cm">// never — function that never returns</span>
<span class="kw">function</span> <span class="fn">fail</span>(msg: <span class="ty">string</span>): <span class="ty">never</span> {
  <span class="kw">throw new</span> Error(msg);
}`,
      useCases: ['Annotating function return types for documentation', 'Using unknown for external API responses', 'Using never to enforce exhaustive switch cases'],
      mistakes: ['Overusing any (defeats the purpose of TypeScript)', 'Confusing null and undefined', 'Not enabling strict mode in tsconfig'],
      qa: [
        { q: 'What is the difference between any and unknown?', a: 'Both accept any value. But unknown forces you to narrow the type before using it (typeof, instanceof checks), while any lets you do anything without checks. Use unknown for safer type handling of external data.' },
        { q: 'When would you use the never type?', a: 'Use never for functions that always throw, for exhaustive checks in switch statements, or conditional types that should be unreachable. It signals to the compiler that execution cannot reach that point.' },
        { q: 'What is type inference?', a: 'TypeScript automatically deduces the type of a variable based on its initial value. let x = 5 is inferred as number. You only need explicit annotations when the type cannot be inferred.' },
        { q: 'What is strict mode in TypeScript?', a: 'Enabling "strict": true in tsconfig.json turns on several strictness checks including strictNullChecks (null/undefined are not assignable to other types), noImplicitAny, strictFunctionTypes, and more.' },
        { q: 'How does void differ from undefined?', a: 'void is used for functions that do not return a meaningful value (they implicitly return undefined). Returning void means the caller should not use the return value. undefined is an actual assignable type.' },
      ]
    },
    s03: {
      explain: `TypeScript brings full type safety to functions — parameters, return values, optional arguments, default values, and rest parameters can all be typed. Function overloads let you define multiple call signatures. The <code>never</code> return type marks functions that throw or loop forever.`,
      concepts: ['Parameter type annotations', 'Return type annotations', 'Optional parameters (?)', 'Default parameter values', 'Rest parameters (...args)', 'Function overloads', 'void vs never return types', 'Callback typing'],
      code: `<span class="cm">// Basic annotation</span>
<span class="kw">function</span> <span class="fn">greet</span>(name: <span class="ty">string</span>, age?: <span class="ty">number</span>): <span class="ty">string</span> {
  <span class="kw">return</span> <span class="st">\`Hello \${name}\${age ? <span class="st">", age \${age}"</span> : <span class="st">""</span>}\`</span>;
}

<span class="cm">// Rest parameters</span>
<span class="kw">function</span> <span class="fn">sum</span>(...nums: <span class="ty">number</span>[]): <span class="ty">number</span> {
  <span class="kw">return</span> nums.reduce((a, b) => a + b, <span class="nm">0</span>);
}

<span class="cm">// Function overloads</span>
<span class="kw">function</span> <span class="fn">format</span>(val: <span class="ty">string</span>): <span class="ty">string</span>;
<span class="kw">function</span> <span class="fn">format</span>(val: <span class="ty">number</span>, decimals: <span class="ty">number</span>): <span class="ty">string</span>;
<span class="kw">function</span> <span class="fn">format</span>(val: <span class="ty">any</span>, decimals = <span class="nm">2</span>): <span class="ty">string</span> {
  <span class="kw">return typeof</span> val === <span class="st">"number"</span> ? val.toFixed(decimals) : val;
}

<span class="cm">// Callback type</span>
<span class="kw">type</span> <span class="ty">Transformer</span> = (input: <span class="ty">string</span>) => <span class="ty">string</span>;
<span class="kw">const</span> <span class="fn">upper</span>: <span class="ty">Transformer</span> = (s) => s.toUpperCase();`,
      useCases: ['Typing event handler callbacks', 'Defining API functions with typed parameters', 'Creating utility functions with precise return types'],
      mistakes: ['Forgetting to annotate return type on complex functions', 'Using any[] for rest parameters', 'Mixing optional and required parameters out of order'],
      qa: [
        { q: 'What is a function overload in TypeScript?', a: 'Overloads let you define multiple call signatures for one function. You write several declarations without bodies, then one implementation signature that covers all cases. TypeScript picks the correct overload at call sites.' },
        { q: 'Difference between optional (?) and default parameters?', a: 'Optional parameters may be omitted (type is T | undefined). Default parameters have a fallback value and are also optional at the call site, but inside the function the type is always T.' },
        { q: 'How do you type a callback function?', a: 'Define it as a type alias: type Callback = (err: Error | null, data: string) => void; or inline: function run(cb: (x: number) => boolean) {}. Always annotate parameter and return types.' },
        { q: 'What does the void return type mean?', a: 'void indicates a function does not return a useful value. The caller should not use the return value. Functions with void can still return undefined implicitly.' },
        { q: 'Can TypeScript infer return types automatically?', a: 'Yes. TypeScript infers return types from the function body. However, explicitly annotating return types is a best practice for public APIs — it catches bugs when the body accidentally returns the wrong type.' },
      ]
    },
    s04: {
      explain: `TypeScript provides typed arrays, fixed-length tuples, and enumerations. Arrays can be typed as <code>T[]</code> or <code>Array&lt;T&gt;</code>. Tuples are arrays with a fixed number of elements of specific types in specific positions. Enums create named constant sets.`,
      concepts: ['Array types: T[] and Array<T>', 'Readonly arrays', 'Tuple types [T1, T2]', 'Named tuple elements', 'Numeric enums', 'String enums', 'Const enums (inlined at compile time)', 'Reverse mapping in numeric enums'],
      code: `<span class="cm">// Arrays</span>
<span class="kw">const</span> ids: <span class="ty">number</span>[] = [<span class="nm">1</span>, <span class="nm">2</span>, <span class="nm">3</span>];
<span class="kw">const</span> names: <span class="ty">ReadonlyArray</span><<span class="ty">string</span>> = [<span class="st">"a"</span>, <span class="st">"b"</span>];

<span class="cm">// Tuples</span>
<span class="kw">type</span> <span class="ty">Point</span> = [x: <span class="ty">number</span>, y: <span class="ty">number</span>];
<span class="kw">const</span> p: <span class="ty">Point</span> = [<span class="nm">10</span>, <span class="nm">20</span>];
<span class="kw">const</span> [x, y] = p;  <span class="cm">// destructuring</span>

<span class="cm">// Enums</span>
<span class="kw">enum</span> <span class="ty">Direction</span> { Up, Down, Left, Right }
<span class="kw">const</span> dir: <span class="ty">Direction</span> = <span class="ty">Direction</span>.Up; <span class="cm">// 0</span>

<span class="kw">enum</span> <span class="ty">Status</span> {
  Active = <span class="st">"ACTIVE"</span>,
  Inactive = <span class="st">"INACTIVE"</span>,
}

<span class="cm">// Const enum — inlined at compile time</span>
<span class="kw">const enum</span> <span class="ty">Role</span> { Admin = <span class="nm">1</span>, User, Guest }
<span class="kw">const</span> r = <span class="ty">Role</span>.Admin; <span class="cm">// compiles to: const r = 1;</span>`,
      useCases: ['Using tuples for CSV row parsing', 'Enums for HTTP status codes or state machines', 'ReadonlyArray to prevent accidental mutation'],
      mistakes: ['Using numeric enums when string enums are clearer', 'Forgetting tuple length limits', 'Confusing const enums with regular enums'],
      qa: [
        { q: 'What is the difference between a tuple and an array in TypeScript?', a: 'An array has a variable length and all elements are the same type. A tuple has a fixed length and each position can have a different type. TypeScript enforces both the types and positions.' },
        { q: 'When should you use string enums vs numeric enums?', a: 'Use string enums when the values appear in logs, APIs, or databases — they are human-readable. Use numeric enums for flags or bitwise operations. String enums are generally preferred for clarity.' },
        { q: 'What is a const enum?', a: 'A const enum is fully erased at compile time and its members are inlined as literals. This produces smaller bundle output. Downside: you cannot iterate over const enums at runtime.' },
        { q: 'How do you make a TypeScript array immutable?', a: 'Use ReadonlyArray<T> or readonly T[] to prevent push, pop, or mutation. You can also use "as const" to create a deeply readonly literal array.' },
        { q: 'What is reverse mapping in numeric enums?', a: 'Numeric enums compile to an object with both forward (name→value) and reverse (value→name) mappings. Direction[0] === "Up". String enums do not have reverse mappings.' },
      ]
    },
    s05: {
      explain: `Type aliases (<code>type</code>) let you name any type — objects, unions, primitives, functions. For object shapes, they define the property names and their types. Properties can be optional (<code>?</code>) or readonly. Type aliases support generics and can reference themselves recursively.`,
      concepts: ['type keyword for aliasing', 'Object type shapes', 'Optional properties (?)', 'Readonly properties', 'Nested object types', 'Recursive type aliases', 'Type alias vs Interface (when to use each)', 'Intersection with &'],
      code: `<span class="kw">type</span> <span class="ty">User</span> = {
  id: <span class="ty">number</span>;
  name: <span class="ty">string</span>;
  email?: <span class="ty">string</span>;     <span class="cm">// optional</span>
  <span class="kw">readonly</span> createdAt: <span class="ty">Date</span>;
};

<span class="cm">// Nested type</span>
<span class="kw">type</span> <span class="ty">Address</span> = { street: <span class="ty">string</span>; city: <span class="ty">string</span> };
<span class="kw">type</span> <span class="ty">Person</span> = User & { address: <span class="ty">Address</span> };

<span class="cm">// Recursive type (JSON)</span>
<span class="kw">type</span> <span class="ty">JSONValue</span> =
  | <span class="ty">string</span> | <span class="ty">number</span> | <span class="ty">boolean</span> | <span class="ty">null</span>
  | <span class="ty">JSONValue</span>[]
  | { [key: <span class="ty">string</span>]: <span class="ty">JSONValue</span> };

<span class="cm">// Generic alias</span>
<span class="kw">type</span> <span class="ty">ApiResponse</span><<span class="ty">T</span>> = {
  data: <span class="ty">T</span>;
  status: <span class="ty">number</span>;
  message: <span class="ty">string</span>;
};`,
      useCases: ['Defining API request/response shapes', 'Creating reusable generic wrappers', 'Typing configuration objects'],
      mistakes: ['Using type alias when interface is more appropriate (class shapes)', 'Forgetting readonly prevents only reassignment, not deep mutation', 'Over-nesting types causing hard-to-read code'],
      qa: [
        { q: 'When should you use type alias vs interface?', a: 'Use interface for objects that can be extended or implemented by classes. Use type alias for unions, intersections, primitives, or when you need advanced type features. Both work for object shapes in most cases.' },
        { q: 'What does readonly do in a type?', a: 'readonly prevents reassignment of a property after initialization. However, it only protects one level — if the property is an object, its nested properties can still be mutated.' },
        { q: 'Can type aliases be merged like interfaces?', a: 'No. Type aliases cannot be declared multiple times (no declaration merging). Interfaces support declaration merging — multiple declarations of the same interface are merged into one.' },
        { q: 'What is the & operator for types?', a: 'The & operator creates an intersection type — a type that must satisfy all combined types. type AdminUser = User & AdminRole; means the value must have all properties of both User and AdminRole.' },
        { q: 'How do you create a recursive type in TypeScript?', a: 'A type alias can reference itself. For example, type TreeNode = { value: number; children: TreeNode[] }. This works because TypeScript resolves recursive types lazily.' },
      ]
    },
    s06: {
      explain: `Interfaces define the public contract of an object or class. They support extension (multiple inheritance), can be implemented by classes, and support declaration merging (multiple declarations in the same scope are combined). Interfaces are preferred for class contracts while type aliases are preferred for unions.`,
      concepts: ['interface keyword', 'Optional and readonly properties', 'Extending interfaces (extends)', 'Implementing interfaces in classes', 'Function signatures in interfaces', 'Index signatures [key: string]: T', 'Declaration merging', 'Interface vs Type Alias'],
      code: `<span class="kw">interface</span> <span class="ty">Animal</span> {
  name: <span class="ty">string</span>;
  makeSound(): <span class="ty">void</span>;
}

<span class="cm">// Extending</span>
<span class="kw">interface</span> <span class="ty">Dog</span> <span class="kw">extends</span> <span class="ty">Animal</span> {
  breed: <span class="ty">string</span>;
  fetch(item: <span class="ty">string</span>): <span class="ty">boolean</span>;
}

<span class="cm">// Class implementing interface</span>
<span class="kw">class</span> <span class="ty">Labrador</span> <span class="kw">implements</span> <span class="ty">Dog</span> {
  constructor(
    <span class="kw">public</span> name: <span class="ty">string</span>,
    <span class="kw">public</span> breed: <span class="ty">string</span>
  ) {}
  <span class="fn">makeSound</span>() { console.log(<span class="st">"Woof!"</span>); }
  <span class="fn">fetch</span>(item: <span class="ty">string</span>) { <span class="kw">return true</span>; }
}

<span class="cm">// Index signature</span>
<span class="kw">interface</span> <span class="ty">Dictionary</span> {
  [key: <span class="ty">string</span>]: <span class="ty">string</span>;
}`,
      useCases: ['Defining service contracts (Repository, Logger)', 'Typing third-party library objects', 'Creating plugin systems with declaration merging'],
      mistakes: ['Using interface for union types (should use type)', 'Forgetting index signatures can override specific properties', 'Not understanding when declaration merging happens'],
      qa: [
        { q: 'Can an interface extend multiple interfaces?', a: 'Yes. interface C extends A, B { ... } creates a type that combines all properties of A and B. This is one of the main advantages of interfaces over type aliases for OOP patterns.' },
        { q: 'What is declaration merging?', a: 'If you declare an interface with the same name twice, TypeScript merges the declarations into one. This is useful for augmenting third-party types or global objects without modifying source files.' },
        { q: 'What is an index signature?', a: 'An index signature [key: string]: T allows any string key with a specific value type. Useful for dictionaries. Note: all explicitly named properties must also conform to the index signature type.' },
        { q: 'Interface vs abstract class — which to use?', a: 'Interfaces are pure type contracts with no runtime presence. Abstract classes exist at runtime and can contain shared implementation. Use interfaces for contracts/polymorphism; use abstract classes when sharing code.' },
        { q: 'Can interfaces describe functions?', a: 'Yes. interface Greeter { (name: string): string; } describes a callable. The class or object implementing it must be callable with the matching signature.' },
      ]
    },
    s07: {
      explain: `Union types (<code>|</code>) mean a value can be one of several types. Intersection types (<code>&</code>) combine types. Literal types restrict values to specific strings or numbers. Discriminated unions add a common literal property to enable exhaustive switching.`,
      concepts: ['Union types T | U', 'Intersection types T & U', 'String literal types', 'Numeric literal types', 'Discriminated unions (tagged unions)', 'Exhaustive checks with never', 'Template literal types'],
      code: `<span class="cm">// Union type</span>
<span class="kw">type</span> <span class="ty">ID</span> = <span class="ty">string</span> | <span class="ty">number</span>;

<span class="cm">// Literal type</span>
<span class="kw">type</span> <span class="ty">Direction</span> = <span class="st">"up"</span> | <span class="st">"down"</span> | <span class="st">"left"</span> | <span class="st">"right"</span>;

<span class="cm">// Discriminated union</span>
<span class="kw">type</span> <span class="ty">Shape</span> =
  | { kind: <span class="st">"circle"</span>; radius: <span class="ty">number</span> }
  | { kind: <span class="st">"rect"</span>; width: <span class="ty">number</span>; height: <span class="ty">number</span> };

<span class="kw">function</span> <span class="fn">area</span>(shape: <span class="ty">Shape</span>): <span class="ty">number</span> {
  <span class="kw">switch</span> (shape.kind) {
    <span class="kw">case</span> <span class="st">"circle"</span>: <span class="kw">return</span> Math.PI * shape.radius ** <span class="nm">2</span>;
    <span class="kw">case</span> <span class="st">"rect"</span>: <span class="kw">return</span> shape.width * shape.height;
    <span class="kw">default</span>: <span class="kw">const</span> _: <span class="ty">never</span> = shape; <span class="kw">return</span> _;
  }
}

<span class="cm">// Template literal type</span>
<span class="kw">type</span> <span class="ty">EventName</span> = <span class="st">\`on\${Capitalize&lt;string&gt;}\`</span>;`,
      useCases: ['Typing API responses that can succeed or fail', 'State machine with discriminated unions', 'Restricting function arguments to valid values'],
      mistakes: ['Not using discriminated unions — missing a type-safe discriminant', 'Forgetting exhaustive checks (missing the never case)', 'Overusing unions when generics would be cleaner'],
      qa: [
        { q: 'What is a discriminated union?', a: 'A discriminated union is a union type where each member has a common literal property (the discriminant). TypeScript uses this property in switch/if checks to narrow the type to the specific member.' },
        { q: 'How do you enforce exhaustive checks in a switch statement?', a: 'Add a default case that assigns the value to never: const _exhaustive: never = shape. If a new variant is added to the union without a case, TypeScript errors because the new type cannot be assigned to never.' },
        { q: 'What is the difference between | and & for types?', a: '| creates a union — value can be any one of the types. & creates an intersection — value must satisfy all the types simultaneously.' },
        { q: 'What are template literal types?', a: 'TypeScript 4.1+ supports template literal types: type EventName = `on${string}`. This creates types like "onClick", "onChange" etc. Very powerful when combined with mapped types.' },
        { q: 'Can you use union types with primitives?', a: 'Yes. type StringOrNumber = string | number. You can also mix objects and primitives: type Payload = string | { id: number }. TypeScript narrows properly with typeof checks.' },
      ]
    },
    s08: {
      explain: `Type assertions tell the compiler "trust me, I know the type". Type guards are runtime checks that narrow types. TypeScript narrows automatically with <code>typeof</code>, <code>instanceof</code>, and equality checks. Custom type predicates let you define your own guards.`,
      concepts: ['Type assertions: as Type and <Type>', 'Double assertion via unknown', 'typeof type guard', 'instanceof type guard', 'in operator narrowing', 'User-defined type predicates (is)', 'Assertion functions', 'Non-null assertion operator (!)'],
      code: `<span class="cm">// Type assertion</span>
<span class="kw">const</span> input = document.<span class="fn">getElementById</span>(<span class="st">"name"</span>) <span class="kw">as</span> <span class="ty">HTMLInputElement</span>;

<span class="cm">// typeof guard</span>
<span class="kw">function</span> <span class="fn">log</span>(val: <span class="ty">string</span> | <span class="ty">number</span>) {
  <span class="kw">if</span> (<span class="kw">typeof</span> val === <span class="st">"string"</span>) val.toUpperCase(); <span class="cm">// string</span>
  <span class="kw">else</span> val.toFixed(<span class="nm">2</span>);  <span class="cm">// number</span>
}

<span class="cm">// User-defined type predicate</span>
<span class="kw">function</span> <span class="fn">isUser</span>(obj: <span class="ty">any</span>): obj <span class="kw">is</span> <span class="ty">User</span> {
  <span class="kw">return</span> <span class="kw">typeof</span> obj.name === <span class="st">"string"</span>;
}

<span class="cm">// in operator</span>
<span class="kw">if</span> (<span class="st">"email"</span> <span class="kw">in</span> user) {
  console.log(user.email);   <span class="cm">// narrowed</span>
}

<span class="cm">// Non-null assertion</span>
<span class="kw">const</span> el = document.<span class="fn">getElementById</span>(<span class="st">"app"</span>)!;`,
      useCases: ['Narrowing after parsing JSON', 'Checking class instances with instanceof', 'Type-safe plugin architecture with type predicates'],
      mistakes: ['Overusing ! non-null assertion (can cause runtime errors)', 'Using as without verifying the actual type at runtime', 'Not considering that typeof null === "object"'],
      qa: [
        { q: 'What is the difference between type assertion and type casting?', a: 'TypeScript has type assertions (as Type), not casts. Assertions do NOT convert the runtime value — they only tell the compiler to treat it as that type. If wrong, it causes a runtime error.' },
        { q: 'What is a type predicate?', a: 'A function with return type "param is Type". When the function returns true, TypeScript narrows the parameter to that type in the calling scope. Example: function isString(val: unknown): val is string { return typeof val === "string"; }' },
        { q: 'When is it safe to use the non-null assertion (!)?', a: 'Use ! only when you are certain the value cannot be null/undefined and TypeScript cannot prove it. For example after DOM queries with known IDs. Prefer optional chaining (?.) where possible.' },
        { q: 'How does the in operator narrow types?', a: 'if ("fly" in animal) narrows animal to types that have a fly property. This works with discriminated unions or when checking for optional properties.' },
        { q: 'Can you assert to any type using as?', a: 'You can only assert to a type that overlaps with the value. To assert to a completely unrelated type, you must double-assert through unknown: (value as unknown) as TargetType.' },
      ]
    },
    s09: {
      explain: `TypeScript classes extend JavaScript classes with access modifiers (<code>public</code>, <code>private</code>, <code>protected</code>), <code>readonly</code>, abstract classes, and interface implementation. The constructor shorthand (parameter properties) reduces boilerplate.`,
      concepts: ['class with typed properties', 'Constructor parameter properties', 'public, private, protected, readonly', 'Getter and setter accessors', 'Static members', 'Abstract classes and methods', 'implements vs extends', 'Class expressions'],
      code: `<span class="kw">abstract class</span> <span class="ty">Animal</span> {
  <span class="kw">constructor</span>(<span class="kw">protected</span> name: <span class="ty">string</span>) {}
  <span class="kw">abstract</span> <span class="fn">speak</span>(): <span class="ty">string</span>;

  <span class="fn">move</span>(dist = <span class="nm">0</span>) {
    console.log(<span class="st">\`\${this.name} moved \${dist}m\`</span>);
  }
}

<span class="kw">class</span> <span class="ty">Dog</span> <span class="kw">extends</span> <span class="ty">Animal</span> {
  <span class="kw">private</span> tricks: <span class="ty">string</span>[] = [];

  <span class="fn">speak</span>() { <span class="kw">return</span> <span class="st">"Woof!"</span>; }

  <span class="fn">learn</span>(trick: <span class="ty">string</span>) {
    this.tricks.push(trick);
  }

  <span class="kw">get</span> <span class="fn">knownTricks</span>() { <span class="kw">return</span> [...this.tricks]; }
}

<span class="kw">const</span> d = <span class="kw">new</span> <span class="ty">Dog</span>(<span class="st">"Rex"</span>);
d.learn(<span class="st">"sit"</span>);
console.log(d.knownTricks);`,
      useCases: ['Service classes in backend (UserService, AuthService)', 'Data models in frontend apps', 'Abstract base classes for plugin systems'],
      mistakes: ['Using private when # (ES private fields) is more appropriate', 'Not calling super() before accessing this in subclass', 'Forgetting abstract methods must be implemented'],
      qa: [
        { q: 'What is the difference between private and #?', a: 'TypeScript private is compile-time only — it can be accessed at runtime via any[]. ES2022 # (hard private fields) are enforced at runtime and not accessible outside the class even via casting.' },
        { q: 'What are parameter properties?', a: 'TypeScript shorthand in constructors: constructor(public name: string) {} automatically creates and assigns a property. This avoids declaring the property and assigning it separately.' },
        { q: 'When would you use an abstract class?', a: 'When you want to share implementation between related classes but prevent direct instantiation. Abstract classes define the contract (abstract methods) and provide default implementations for shared behavior.' },
        { q: 'Can a class implement multiple interfaces?', a: 'Yes. class MyClass implements InterfaceA, InterfaceB { ... }. The class must implement all methods and properties from every listed interface.' },
        { q: 'What is the difference between extends and implements?', a: 'extends inherits implementation from a parent class (can only extend one class). implements declares that the class conforms to an interface contract (can implement multiple), without inheriting any code.' },
      ]
    },
    s10: {
      explain: `Generics allow you to write reusable components that work with multiple types without losing type safety. The type variable <code>T</code> acts as a placeholder filled in at usage time. Constraints (<code>extends</code>) limit what types can be passed in.`,
      concepts: ['Generic functions <T>', 'Generic interfaces and classes', 'Generic constraints: T extends Type', 'keyof constraint', 'Default generic parameters', 'Multiple type parameters', 'Generic utility types (custom)', 'Conditional generics'],
      code: `<span class="cm">// Generic function</span>
<span class="kw">function</span> <span class="fn">first</span><<span class="ty">T</span>>(arr: <span class="ty">T</span>[]): <span class="ty">T</span> | <span class="ty">undefined</span> {
  <span class="kw">return</span> arr[<span class="nm">0</span>];
}

<span class="cm">// Constraint with keyof</span>
<span class="kw">function</span> <span class="fn">getProperty</span><<span class="ty">T</span>, <span class="ty">K</span> <span class="kw">extends keyof</span> <span class="ty">T</span>>(
  obj: <span class="ty">T</span>, key: <span class="ty">K</span>
): <span class="ty">T</span>[<span class="ty">K</span>] {
  <span class="kw">return</span> obj[key];
}

<span class="cm">// Generic interface</span>
<span class="kw">interface</span> <span class="ty">Stack</span><<span class="ty">T</span>> {
  push(item: <span class="ty">T</span>): <span class="ty">void</span>;
  pop(): <span class="ty">T</span> | <span class="ty">undefined</span>;
  peek(): <span class="ty">T</span> | <span class="ty">undefined</span>;
  <span class="kw">readonly</span> size: <span class="ty">number</span>;
}

<span class="cm">// Generic class</span>
<span class="kw">class</span> <span class="ty">Box</span><<span class="ty">T</span>> {
  <span class="kw">constructor</span>(<span class="kw">private</span> value: <span class="ty">T</span>) {}
  <span class="fn">unwrap</span>(): <span class="ty">T</span> { <span class="kw">return</span> this.value; }
  <span class="fn">map</span><<span class="ty">U</span>>(fn: (v: <span class="ty">T</span>) => <span class="ty">U</span>): <span class="ty">Box</span><<span class="ty">U</span>> {
    <span class="kw">return new</span> <span class="ty">Box</span>(fn(this.value));
  }
}`,
      useCases: ['Generic repository pattern (CRUD operations)', 'Typed HTTP client wrapper', 'Data transformation pipeline'],
      mistakes: ['Overcomplicating generics when a union type would suffice', 'Not using constraints — causing "T has no property" errors', 'Using any inside generic functions (defeats the purpose)'],
      qa: [
        { q: 'When should you use generics vs union types?', a: 'Use generics when the caller decides the type and you want the output type to match the input type. Use union types when the function must handle a known set of types differently.' },
        { q: 'What is a generic constraint?', a: 'function fn<T extends HasLength> ensures T has at minimum the properties of HasLength. Without constraints, TypeScript cannot know what properties T has.' },
        { q: 'What is the keyof operator?', a: 'keyof T produces a union of all keys of T as string literal types. keyof { name: string; age: number } gives "name" | "age". Used in constraints: K extends keyof T.' },
        { q: 'Can generic parameters have defaults?', a: 'Yes. function fn<T = string>(...) sets a default. If the caller does not provide T, it defaults to string. Works similarly to default function parameters.' },
        { q: 'What is a generic class?', a: 'A class parameterized with a type variable: class Container<T> { ... }. Each instance captures its type: new Container<number>(). The type variable is available throughout the class body.' },
      ]
    },
    s11: {
      explain: `TypeScript uses ES modules (import/export) as the primary module system. Namespaces are a legacy TypeScript-specific way to organize code. Always prefer ES modules for new code. Type-only imports (<code>import type</code>) are erased at compile time.`,
      concepts: ['Named exports and imports', 'Default exports', 'Re-exports (barrel files)', 'import type (type-only imports)', 'Namespace declaration', 'Ambient modules (declare module)', 'Module resolution strategies', 'Path aliases in tsconfig'],
      code: `<span class="cm">// math.ts — named exports</span>
<span class="kw">export const</span> <span class="fn">add</span> = (a: <span class="ty">number</span>, b: <span class="ty">number</span>) => a + b;
<span class="kw">export type</span> { <span class="ty">MathResult</span> };

<span class="cm">// Barrel file (index.ts)</span>
<span class="kw">export</span> { <span class="fn">add</span>, <span class="fn">subtract</span> } <span class="kw">from</span> <span class="st">"./math"</span>;
<span class="kw">export</span> * <span class="kw">from</span> <span class="st">"./utils"</span>;

<span class="cm">// import type — erased at runtime</span>
<span class="kw">import type</span> { <span class="ty">User</span> } <span class="kw">from</span> <span class="st">"./types"</span>;

<span class="cm">// Ambient module declaration</span>
<span class="kw">declare module</span> <span class="st">"*.svg"</span> {
  <span class="kw">const</span> src: <span class="ty">string</span>;
  <span class="kw">export default</span> src;
}

<span class="cm">// Namespace (legacy)</span>
<span class="kw">namespace</span> <span class="ty">Validation</span> {
  <span class="kw">export function</span> <span class="fn">isEmail</span>(s: <span class="ty">string</span>): <span class="ty">boolean</span> {
    <span class="kw">return</span> /<span class="st">^[^@]+@[^@]+\.[^@]+$</span>/.test(s);
  }
}`,
      useCases: ['Organizing large codebases with barrel files', 'Typing non-JS assets (SVG, CSS modules)', 'Augmenting third-party module types'],
      mistakes: ['Circular dependencies causing undefined values at runtime', 'Mixing CommonJS require() and ES import', 'Not using import type for type-only imports (slower builds)'],
      qa: [
        { q: 'What is a barrel file?', a: 'A barrel is an index.ts file that re-exports multiple modules from a directory. It simplifies imports: import { UserService, AuthService } from "./services" instead of importing each from their own path.' },
        { q: 'What does import type do?', a: 'import type only imports type information. The import is completely erased from the emitted JavaScript. This improves build performance and prevents accidental circular runtime dependencies.' },
        { q: 'How do you type a third-party module without types?', a: 'Create a .d.ts file or use declare module "module-name" { ... } to provide ambient type declarations. If @types/package exists on npm, install that instead.' },
        { q: 'What is the difference between CommonJS and ES modules?', a: 'CommonJS uses require/module.exports (Node.js default). ES modules use import/export (browser/modern Node). TypeScript can target either with the module tsconfig option. ES modules are the modern standard.' },
        { q: 'What are path aliases?', a: 'In tsconfig.json, you can set paths: { "@utils/*": ["src/utils/*"] } to use import from "@utils/helpers" instead of relative paths. Requires matching config in bundlers like webpack or Vite.' },
      ]
    },
    s12: {
      explain: `TypeScript provides type definitions for all browser DOM APIs. Elements are typed generically (<code>HTMLElement</code>) but can be narrowed to specific types like <code>HTMLInputElement</code> or <code>HTMLButtonElement</code>. Event listeners are typed with <code>EventTarget</code> and specific event types.`,
      concepts: ['Document.querySelector return types', 'HTMLElement subtype hierarchy', 'Typed event listeners', 'Event.target vs Event.currentTarget', 'DOM manipulation type safety', 'Custom events with detail typing', 'TypeScript with web components', 'lib option in tsconfig'],
      code: `<span class="cm">// Typed DOM query</span>
<span class="kw">const</span> btn = document
  .<span class="fn">querySelector</span><<span class="ty">HTMLButtonElement</span>>(<span class="st">"#submit-btn"</span>)!;

<span class="cm">// Typed event listener</span>
btn.addEventListener(<span class="st">"click"</span>, (e: <span class="ty">MouseEvent</span>) => {
  console.log(e.clientX, e.clientY);
});

<span class="cm">// Input event</span>
<span class="kw">const</span> input = document
  .<span class="fn">querySelector</span><<span class="ty">HTMLInputElement</span>>(<span class="st">"#search"</span>)!;
input.addEventListener(<span class="st">"input"</span>, (e) => {
  <span class="kw">const</span> target = e.target <span class="kw">as</span> <span class="ty">HTMLInputElement</span>;
  console.log(target.value);
});

<span class="cm">// Custom event</span>
<span class="kw">const</span> event = <span class="kw">new</span> <span class="ty">CustomEvent</span><<span class="ty">{ userId: number }</span>>(
  <span class="st">"userLoggedIn"</span>, { detail: { userId: <span class="nm">42</span> } }
);`,
      useCases: ['Form validation with typed input values', 'Dynamic UI updates with typed DOM manipulation', 'Custom events for component communication'],
      mistakes: ['Forgetting querySelector can return null', 'Overusing non-null assertion on DOM queries', 'Not setting lib: ["dom"] in tsconfig'],
      qa: [
        { q: 'Why does querySelector return Element | null?', a: 'The element might not exist in the DOM. TypeScript forces you to handle the null case. Use optional chaining (?.) or non-null assertion (!) when you are certain the element exists.' },
        { q: 'What is the difference between Event.target and Event.currentTarget?', a: 'target is the element that triggered the event. currentTarget is the element the listener is attached to. They differ during event bubbling.' },
        { q: 'How do you use generics with querySelector?', a: 'document.querySelector<HTMLInputElement>("#myInput") narrows the return type to HTMLInputElement | null instead of Element | null, giving you access to input-specific properties like .value.' },
        { q: 'What lib options are needed for DOM types?', a: 'In tsconfig.json: "lib": ["ES2020", "DOM", "DOM.Iterable"]. The DOM lib provides all browser global types. Without it, document, window, etc. are unknown.' },
        { q: 'How do you type a custom event?', a: 'CustomEvent<T> is generic. new CustomEvent<MyDetail>("myEvent", { detail: myData }). To listen: element.addEventListener("myEvent", (e: CustomEvent<MyDetail>) => { e.detail }).' },
      ]
    },
    s13: {
      explain: `Node.js types are provided by the <code>@types/node</code> package. This gives you typed access to core modules like <code>fs</code>, <code>path</code>, <code>http</code>, <code>process</code>, and more. Set <code>module: "CommonJS"</code> or <code>"NodeNext"</code> in tsconfig depending on your Node version.`,
      concepts: ['Installing @types/node', 'Typed fs, path, http modules', 'process.env typing', 'Buffer and stream types', 'Worker threads types', 'ESM vs CJS in Node.js', 'tsconfig for Node projects', 'ts-node and tsx for development'],
      code: `<span class="cm">// package.json: npm i -D @types/node</span>

<span class="kw">import</span> { readFile, writeFile } <span class="kw">from</span> <span class="st">"fs/promises"</span>;
<span class="kw">import</span> { join, dirname } <span class="kw">from</span> <span class="st">"path"</span>;
<span class="kw">import</span> { fileURLToPath } <span class="kw">from</span> <span class="st">"url"</span>;

<span class="cm">// Reading a file</span>
<span class="kw">async function</span> <span class="fn">readConfig</span>(filename: <span class="ty">string</span>): <span class="ty">Promise</span><<span class="ty">string</span>> {
  <span class="kw">const</span> content = <span class="kw">await</span> <span class="fn">readFile</span>(filename, <span class="st">"utf-8"</span>);
  <span class="kw">return</span> content;
}

<span class="cm">// Typing process.env</span>
<span class="kw">interface</span> <span class="ty">Env</span> {
  PORT: <span class="ty">string</span>;
  DATABASE_URL: <span class="ty">string</span>;
}
<span class="kw">const</span> env = process.env <span class="kw">as unknown as</span> <span class="ty">Env</span>;

<span class="cm">// HTTP server</span>
<span class="kw">import</span> http <span class="kw">from</span> <span class="st">"http"</span>;
<span class="kw">const</span> server = http.<span class="fn">createServer</span>((req, res) => {
  res.<span class="fn">end</span>(<span class="st">"Hello TypeScript!"</span>);
});`,
      useCases: ['CLI tools with typed argument parsing', 'File processing scripts', 'HTTP servers without a framework'],
      mistakes: ['Not installing @types/node separately', 'Mixing ESM and CJS imports', 'Not typing process.env (all values are string | undefined)'],
      qa: [
        { q: 'How do you set up TypeScript for a Node.js project?', a: 'npm init -y, npm i typescript @types/node ts-node -D, npx tsc --init. Set target to ES2020+, module to CommonJS (for older Node) or NodeNext (for Node 18+).' },
        { q: 'Why are all process.env values string | undefined?', a: 'Environment variables are always strings. TypeScript types them as string | undefined because they may not be set. Create a typed wrapper or validate at startup with a schema library like zod.' },
        { q: 'What is ts-node?', a: 'ts-node is a TypeScript execution engine for Node.js that compiles TypeScript on the fly. Good for development. For production, compile with tsc first. tsx is a faster alternative.' },
        { q: 'How does ESM work in Node.js with TypeScript?', a: 'Set "module": "NodeNext" and "moduleResolution": "NodeNext" in tsconfig. Files must use .js extensions in imports even for .ts sources. Add "type": "module" in package.json.' },
        { q: 'What tsconfig target should you use for Node.js?', a: 'Match the target to your Node.js version. Node 18 supports ES2022. Node 20+ supports ES2023. Use a newer target to get more native features without polyfills.' },
      ]
    },
    s14: {
      explain: `Express with TypeScript requires <code>@types/express</code>. You type request and response objects using generics: <code>Request&lt;Params, ResBody, ReqBody, Query&gt;</code>. Middleware and routers can be typed. Using <code>express-async-errors</code> or wrapper functions handles async error propagation.`,
      concepts: ['@types/express installation', 'Typed Request and Response', 'Custom request properties (augmentation)', 'Typed middleware', 'Router typing', 'Error handling middleware', 'Async middleware wrappers', 'Request validation with zod'],
      code: `<span class="kw">import</span> express, { <span class="ty">Request</span>, <span class="ty">Response</span>, <span class="ty">NextFunction</span> } <span class="kw">from</span> <span class="st">"express"</span>;

<span class="cm">// Typed request body</span>
<span class="kw">interface</span> <span class="ty">CreateUserBody</span> {
  name: <span class="ty">string</span>; email: <span class="ty">string</span>;
}

<span class="kw">const</span> router = express.<span class="fn">Router</span>();

router.<span class="fn">post</span><<span class="ty">never</span>, <span class="ty">any</span>, <span class="ty">CreateUserBody</span>>(
  <span class="st">"/users"</span>,
  <span class="kw">async</span> (req: <span class="ty">Request</span><<span class="ty">never</span>, <span class="ty">any</span>, <span class="ty">CreateUserBody</span>>, res) => {
    <span class="kw">const</span> { name, email } = req.body;  <span class="cm">// typed!</span>
    res.<span class="fn">json</span>({ id: <span class="nm">1</span>, name, email });
  }
);

<span class="cm">// Augment Request type</span>
<span class="kw">declare global</span> {
  <span class="kw">namespace</span> <span class="ty">Express</span> {
    <span class="kw">interface</span> <span class="ty">Request</span> { user?: <span class="ty">AuthUser</span> }
  }
}`,
      useCases: ['REST API with typed request/response', 'JWT middleware with typed user payload', 'Input validation with zod + express-validator'],
      mistakes: ['Not augmenting Request to add user property', 'Forgetting async errors must be caught and passed to next()', 'Using any for req.body without validation'],
      qa: [
        { q: 'How do you type request body in Express?', a: 'Use the Request generic: Request<Params, ResBody, ReqBody, Query>. The third generic is the body type. You can also cast: const body = req.body as CreateUserDto.' },
        { q: 'How do you add custom properties to Express Request?', a: 'Augment the global Express namespace: declare global { namespace Express { interface Request { user?: User } } }. Place this in a .d.ts file like types/express.d.ts.' },
        { q: 'How do you handle async errors in Express?', a: 'Express does not catch async errors by default. Either use express-async-errors package, or wrap handlers: const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next).' },
        { q: 'What packages do you need for TypeScript + Express?', a: 'npm i express; npm i -D typescript @types/express @types/node ts-node. Optionally: zod or class-validator for runtime validation.' },
        { q: 'How do you type Express middleware?', a: 'type AuthMiddleware = (req: Request, res: Response, next: NextFunction) => void. Or implement RequestHandler from @types/express which is the same signature.' },
      ]
    },
    s15: {
      explain: `TypeScript and React work brilliantly together. Props are typed with interfaces or type aliases. Hooks like <code>useState</code>, <code>useRef</code>, and <code>useReducer</code> are generic. Event handlers use React-specific event types like <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code>. Use <code>.tsx</code> for files with JSX.`,
      concepts: ['FC and ReactNode types', 'Typing props with interface', 'Generic useState<T>', 'Typed event handlers', 'Typed useRef<T>', 'useReducer with discriminated unions', 'Context typing', 'Typed custom hooks', 'forwardRef typing'],
      code: `<span class="kw">import</span> React, { useState, useRef } <span class="kw">from</span> <span class="st">"react"</span>;

<span class="cm">// Typed props</span>
<span class="kw">interface</span> <span class="ty">ButtonProps</span> {
  label: <span class="ty">string</span>;
  onClick: () => <span class="ty">void</span>;
  variant?: <span class="st">"primary"</span> | <span class="st">"secondary"</span>;
  disabled?: <span class="ty">boolean</span>;
}

<span class="kw">const</span> <span class="fn">Button</span>: <span class="ty">React.FC</span><<span class="ty">ButtonProps</span>> = ({
  label, onClick, variant = <span class="st">"primary"</span>, disabled
}) => (
  <<span class="ty">button</span> onClick={onClick} disabled={disabled}
    className={<span class="st">\`btn btn-\${variant}\`</span>}>
    {label}
  </<span class="ty">button</span>>
);

<span class="cm">// Typed hook usage</span>
<span class="kw">const</span> [count, setCount] = useState<<span class="ty">number</span>>(<span class="nm">0</span>);
<span class="kw">const</span> inputRef = useRef<<span class="ty">HTMLInputElement</span>>(null);

<span class="cm">// Typed event handler</span>
<span class="kw">const</span> <span class="fn">handleChange</span> = (e: <span class="ty">React.ChangeEvent</span><<span class="ty">HTMLInputElement</span>>) => {
  console.log(e.target.value);
};`,
      useCases: ['Component libraries with strict prop typing', 'Form handling with typed state', 'Custom hooks returning typed values'],
      mistakes: ['Using React.FC (removes children prop in newer React)', 'Forgetting to type the generic in useRef (returns T | null)', 'Not typing context default value properly'],
      qa: [
        { q: 'Should you use React.FC or just function declarations?', a: 'React.FC is debated. It removes the children prop in React 18+. Most modern guides recommend plain function declarations with typed props parameter: function Button({ label }: ButtonProps) {}.' },
        { q: 'How do you type useState with an object?', a: 'const [user, setUser] = useState<User | null>(null). The generic ensures setUser only accepts User | null. TypeScript infers it from the initial value if you provide one.' },
        { q: 'How do you type React context?', a: 'const ThemeContext = createContext<ThemeType | null>(null). In the consumer, use non-null assertion or a custom hook that checks for null. Providing a default value that satisfies the type avoids null checks.' },
        { q: 'What is the correct type for children prop?', a: 'React.ReactNode is the widest type accepting JSX, strings, numbers, null, arrays. React.ReactElement is more specific — only JSX elements. Use ReactNode for general children.' },
        { q: 'How do you type useReducer?', a: 'Define a discriminated union for actions and a state type. useReducer<Reducer<State, Action>>(reducer, initialState). The reducer function automatically gets typed parameters.' },
      ]
    },
    s16: {
      explain: `TypeScript ships with powerful built-in utility types that transform existing types. <code>Partial</code> makes all properties optional. <code>Required</code> makes all required. <code>Pick</code> and <code>Omit</code> select/exclude properties. <code>Record</code> builds dictionary types. These are essential for real-world TypeScript.`,
      concepts: ['Partial<T> — all optional', 'Required<T> — all required', 'Readonly<T> — immutable', 'Pick<T, K> — select keys', 'Omit<T, K> — exclude keys', 'Record<K, V> — dictionary', 'Exclude<T, U> and Extract<T, U>', 'ReturnType<T> and Parameters<T>', 'Awaited<T> for async return types'],
      code: `<span class="kw">interface</span> <span class="ty">User</span> {
  id: <span class="ty">number</span>; name: <span class="ty">string</span>;
  email: <span class="ty">string</span>; age: <span class="ty">number</span>;
}

<span class="cm">// For update operations — all optional</span>
<span class="kw">type</span> <span class="ty">UpdateUser</span> = <span class="ty">Partial</span><<span class="ty">User</span>>;

<span class="cm">// Only public-facing fields</span>
<span class="kw">type</span> <span class="ty">PublicUser</span> = <span class="ty">Pick</span><<span class="ty">User</span>, <span class="st">"id"</span> | <span class="st">"name"</span>>;

<span class="cm">// Exclude internal fields</span>
<span class="kw">type</span> <span class="ty">ClientUser</span> = <span class="ty">Omit</span><<span class="ty">User</span>, <span class="st">"id"</span>>;

<span class="cm">// String → User mapping</span>
<span class="kw">type</span> <span class="ty">UserMap</span> = <span class="ty">Record</span><<span class="ty">string</span>, <span class="ty">User</span>>;

<span class="cm">// Get return type of a function</span>
<span class="kw">function</span> <span class="fn">createUser</span>() { <span class="kw">return</span> { id: <span class="nm">1</span>, name: <span class="st">"Alice"</span> }; }
<span class="kw">type</span> <span class="ty">CreatedUser</span> = <span class="ty">ReturnType</span><<span class="kw">typeof</span> createUser>;`,
      useCases: ['CRUD operations with Partial for updates', 'DTO patterns with Pick/Omit', 'Lookup tables with Record'],
      mistakes: ['Confusing Omit (removes) and Exclude (filters unions)', 'Not using ReturnType to avoid duplicating return types', 'Using Partial everywhere instead of designing proper types'],
      qa: [
        { q: 'What is the difference between Omit and Exclude?', a: 'Omit<T, K> works on object types — it removes properties with keys K. Exclude<T, U> works on union types — it removes union members that are assignable to U.' },
        { q: 'When would you use Required<T>?', a: 'When a type has optional properties but you need a fully populated version — for example, after validation/initialization where you know all fields exist.' },
        { q: 'How does ReturnType work?', a: 'ReturnType<typeof fn> extracts the return type of a function. This avoids manually duplicating the type. Works with any function including async (returns Promise<T>, use Awaited<ReturnType<...>> to unwrap).' },
        { q: 'What is Awaited<T> used for?', a: 'Awaited<T> unwraps Promise types. Awaited<Promise<string>> gives string. Useful with ReturnType for async functions: Awaited<ReturnType<typeof fetchUser>> gives the resolved type.' },
        { q: 'How is Record<K,V> different from { [key: K]: V }?', a: 'Record<K, V> is equivalent to { [key in K]: V }. Record<string, User> and { [key: string]: User } are the same. Record is cleaner and works better with union key types: Record<"a" | "b", number>.' },
      ]
    },
    s17: {
      explain: `Advanced TypeScript features include conditional types (<code>T extends U ? X : Y</code>), mapped types (transform every property of a type), the <code>infer</code> keyword (extract sub-types), and template literal types. These powers enable type-level programming.`,
      concepts: ['Conditional types T extends U ? X : Y', 'Distributive conditional types', 'infer keyword in conditional types', 'Mapped types { [K in keyof T]: ... }', 'Homomorphic mapped types', 'Template literal types', '+/- modifiers in mapped types', 'Deep partial, deep readonly'],
      code: `<span class="cm">// Conditional type</span>
<span class="kw">type</span> <span class="ty">IsArray</span><<span class="ty">T</span>> = <span class="ty">T</span> <span class="kw">extends</span> <span class="ty">any</span>[] ? <span class="st">"yes"</span> : <span class="st">"no"</span>;

<span class="cm">// infer — extract inner type</span>
<span class="kw">type</span> <span class="ty">UnpackPromise</span><<span class="ty">T</span>> =
  <span class="ty">T</span> <span class="kw">extends</span> <span class="ty">Promise</span><<span class="kw">infer</span> <span class="ty">U</span>> ? <span class="ty">U</span> : <span class="ty">T</span>;
<span class="cm">// UnpackPromise&lt;Promise&lt;string&gt;&gt; = string</span>

<span class="cm">// Mapped type</span>
<span class="kw">type</span> <span class="ty">Nullable</span><<span class="ty">T</span>> = { [<span class="ty">K</span> <span class="kw">in keyof</span> <span class="ty">T</span>]: <span class="ty">T</span>[<span class="ty">K</span>] | <span class="ty">null</span> };

<span class="cm">// Remove optional with +/- modifiers</span>
<span class="kw">type</span> <span class="ty">Concrete</span><<span class="ty">T</span>> = { [<span class="ty">K</span> <span class="kw">in keyof</span> <span class="ty">T</span>]-?: <span class="ty">T</span>[<span class="ty">K</span>] };

<span class="cm">// Template literal — event types</span>
<span class="kw">type</span> <span class="ty">On</span><<span class="ty">T extends string</span>> = <span class="st">\`on\${Capitalize&lt;T&gt;}\`</span>;
<span class="kw">type</span> <span class="ty">ClickEvent</span> = <span class="ty">On</span><<span class="st">"click"</span>>;  <span class="cm">// "onClick"</span>`,
      useCases: ['Deep utility types (DeepPartial, DeepReadonly)', 'Type-safe event emitter systems', 'ORM-like query builder types'],
      mistakes: ['Forgetting conditional types distribute over unions', 'Overcomplicating types — hard to debug and understand', 'Not testing complex types with playground'],
      qa: [
        { q: 'What does the infer keyword do?', a: 'infer declares a type variable within a conditional type\'s extends clause. It captures a sub-type from a matched pattern. type ElementType<T> = T extends (infer U)[] ? U : never captures the array element type.' },
        { q: 'What is a distributive conditional type?', a: 'When the checked type is a naked type parameter, conditional types distribute over union members. ToArray<string | number> becomes string[] | number[] not (string | number)[].' },
        { q: 'How do mapped types work?', a: 'type M<T> = { [K in keyof T]: NewType } iterates over all keys of T and transforms each property. Homomorphic mapped types preserve optionality and readonly. You can add or remove modifiers with + and -.' },
        { q: 'What are template literal types useful for?', a: 'They let you express string patterns at the type level: `on${string}` matches any string starting with "on". Combined with mapped types, you can generate all event handler names from a union of event names.' },
        { q: 'How do you write a DeepPartial type?', a: 'type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T. This recursively makes all nested properties optional.' },
      ]
    },
    s18: {
      explain: `<code>tsconfig.json</code> controls how TypeScript compiles your code. Key options include <code>strict</code> (enables all strict checks), <code>target</code> (output JS version), <code>module</code> (module system), <code>outDir</code>/<code>rootDir</code> (file layout), and <code>paths</code> (import aliases). Understanding tsconfig is crucial for production setups.`,
      concepts: ['strict mode and its sub-options', 'target vs lib', 'module and moduleResolution', 'outDir, rootDir, baseUrl', 'include, exclude, files', 'paths for aliases', 'composite and references for monorepos', 'sourceMap for debugging', 'declaration and declarationMap'],
      code: `{
  <span class="st">"compilerOptions"</span>: {
    <span class="st">"target"</span>: <span class="st">"ES2022"</span>,
    <span class="st">"module"</span>: <span class="st">"NodeNext"</span>,
    <span class="st">"moduleResolution"</span>: <span class="st">"NodeNext"</span>,
    <span class="st">"strict"</span>: <span class="kw">true</span>,
    <span class="st">"noUncheckedIndexedAccess"</span>: <span class="kw">true</span>,
    <span class="st">"exactOptionalPropertyTypes"</span>: <span class="kw">true</span>,
    <span class="st">"outDir"</span>: <span class="st">"./dist"</span>,
    <span class="st">"rootDir"</span>: <span class="st">"./src"</span>,
    <span class="st">"baseUrl"</span>: <span class="st">"."</span>,
    <span class="st">"paths"</span>: {
      <span class="st">"@utils/*"</span>: [<span class="st">"src/utils/*"</span>]
    },
    <span class="st">"sourceMap"</span>: <span class="kw">true</span>,
    <span class="st">"declaration"</span>: <span class="kw">true</span>,
    <span class="st">"lib"</span>: [<span class="st">"ES2022"</span>, <span class="st">"DOM"</span>]
  },
  <span class="st">"include"</span>: [<span class="st">"src"</span>],
  <span class="st">"exclude"</span>: [<span class="st">"node_modules"</span>, <span class="st">"dist"</span>]
}`,
      useCases: ['Library publishing with declaration files', 'Monorepo setups with project references', 'Path aliases for clean imports'],
      mistakes: ['Not enabling strict mode (leaves type holes)', 'Mismatching module and moduleResolution', 'Forgetting to exclude node_modules'],
      qa: [
        { q: 'What does "strict": true enable?', a: 'It enables: strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitAny, noImplicitThis, useUnknownInCatchVariables, and alwaysStrict.' },
        { q: 'What is the difference between target and lib?', a: 'target sets the output JavaScript version (what code is emitted). lib sets which type definitions are available (browser APIs, ES features). You can use a low target but still include modern lib types.' },
        { q: 'What does noUncheckedIndexedAccess do?', a: 'It makes array/object index access return T | undefined instead of T. arr[0] is now number | undefined. This prevents runtime errors from out-of-bounds access but requires more type narrowing.' },
        { q: 'What are project references in tsconfig?', a: 'Project references (composite: true + references) allow a monorepo to split into multiple TypeScript projects. Each project compiles independently and can reference others, improving incremental build performance.' },
        { q: 'What is the declaration option for?', a: 'declaration: true emits .d.ts type definition files alongside .js output. Required when publishing an npm package so consumers get type information without the source TypeScript files.' },
      ]
    },
    s19: {
      explain: `Testing TypeScript code requires proper configuration for Jest or Vitest. Use <code>ts-jest</code> or <code>@swc/jest</code> for Jest, or Vitest which has native TypeScript support. Mock types with <code>jest.Mocked&lt;T&gt;</code> and assert with typed matchers.`,
      concepts: ['Jest + ts-jest setup', 'Vitest native TS support', 'Typing mocks with jest.Mocked<T>', 'Testing async functions', 'Mocking modules', 'Type-safe test utilities', 'Testing React components with @testing-library', 'E2E with Playwright + TypeScript'],
      code: `<span class="cm">// vitest / jest — typed test</span>
<span class="kw">import</span> { describe, it, expect, vi } <span class="kw">from</span> <span class="st">"vitest"</span>;
<span class="kw">import</span> { <span class="fn">fetchUser</span> } <span class="kw">from</span> <span class="st">"./user.service"</span>;
<span class="kw">import</span> { <span class="ty">UserRepository</span> } <span class="kw">from</span> <span class="st">"./user.repo"</span>;

<span class="kw">const</span> mockRepo: <span class="ty">jest.Mocked</span><<span class="ty">UserRepository</span>> = {
  findById: vi.fn(),
  save: vi.fn(),
};

describe(<span class="st">"fetchUser"</span>, () => {
  it(<span class="st">"returns user when found"</span>, <span class="kw">async</span> () => {
    <span class="kw">const</span> user = { id: <span class="nm">1</span>, name: <span class="st">"Alice"</span> };
    mockRepo.findById.mockResolvedValue(user);

    <span class="kw">const</span> result = <span class="kw">await</span> <span class="fn">fetchUser</span>(<span class="nm">1</span>, mockRepo);
    expect(result).toEqual(user);
  });
});`,
      useCases: ['Unit testing service layers', 'Integration testing REST APIs', 'Component testing with typed events'],
      mistakes: ['Mocking without types (losing type safety in tests)', 'Not configuring ts-jest for esm modules', 'Testing implementation details instead of behavior'],
      qa: [
        { q: 'Vitest vs Jest — which is better for TypeScript?', a: 'Vitest has native TypeScript support, no configuration needed. Jest requires ts-jest or babel. Vitest is faster and uses Vite under the hood. For Node-only projects, both work. For Vite projects, use Vitest.' },
        { q: 'How do you type a Jest mock function?', a: 'Use jest.MockedFunction<typeof fn> or jest.Mocked<InterfaceType> for entire objects. This gives you type-safe access to mock methods like .mockResolvedValue() with correct parameter types.' },
        { q: 'How do you mock a module in TypeScript tests?', a: 'vi.mock("./module") or jest.mock("./module") at the top. Use vi.mocked(importedFn) to get the typed mock. TypeScript needs the mock to match the actual module shape.' },
        { q: 'What is the difference between unit and integration tests?', a: 'Unit tests test one function/class in isolation with all dependencies mocked. Integration tests test multiple units working together — for example, a route handler with a real database connection.' },
        { q: 'How do you test TypeScript types themselves?', a: 'Use dtslint, tsd, or expect-type for type-level tests. expect<TypeName>().toEqualTypeOf<ExpectedType>() from expect-type asserts types at compile time, not runtime.' },
      ]
    },
    s20: {
      explain: `The best way to solidify TypeScript skills is through real projects. Build a REST API with Express + TypeScript + Prisma, a React app with TypeScript + Redux Toolkit, or a CLI tool. Each project reinforces different TypeScript patterns and configurations.`,
      concepts: ['REST API: Express + Prisma + TypeScript', 'React SPA: Vite + TypeScript + Zustand', 'CLI Tool: Commander.js + TypeScript', 'Full-stack: Next.js + TypeScript', 'Design patterns in TypeScript', 'Repository pattern, Service layer', 'Error handling with typed custom errors', 'Environment configuration'],
      code: `<span class="cm">// Typed custom error class</span>
<span class="kw">class</span> <span class="ty">AppError</span> <span class="kw">extends</span> Error {
  constructor(
    <span class="kw">public</span> message: <span class="ty">string</span>,
    <span class="kw">public</span> statusCode: <span class="ty">number</span>,
    <span class="kw">public</span> code: <span class="ty">string</span>
  ) {
    <span class="kw">super</span>(message);
    this.name = <span class="st">"AppError"</span>;
  }
}

<span class="cm">// Repository pattern</span>
<span class="kw">interface</span> <span class="ty">UserRepository</span> {
  findById(id: <span class="ty">number</span>): <span class="ty">Promise</span><<span class="ty">User</span> | <span class="kw">null</span>>;
  findAll(): <span class="ty">Promise</span><<span class="ty">User</span>[]>;
  create(data: <span class="ty">CreateUserDto</span>): <span class="ty">Promise</span><<span class="ty">User</span>>;
  update(id: <span class="ty">number</span>, data: <span class="ty">Partial</span><<span class="ty">User</span>>): <span class="ty">Promise</span><<span class="ty">User</span>>;
}

<span class="cm">// Result type pattern</span>
<span class="kw">type</span> <span class="ty">Result</span><<span class="ty">T</span>, <span class="ty">E</span> = <span class="ty">AppError</span>> =
  | { ok: <span class="kw">true</span>; value: <span class="ty">T</span> }
  | { ok: <span class="kw">false</span>; error: <span class="ty">E</span> };`,
      useCases: ['E-commerce API with Prisma ORM', 'Dashboard with React + TypeScript', 'DevOps CLI with typed flags'],
      mistakes: ['Not using strict mode from the start', 'Putting all types in one mega file', 'Skipping proper error handling patterns'],
      qa: [
        { q: 'What is the Repository pattern?', a: 'An abstraction layer between your business logic and data access. Define an interface (UserRepository) and implement it for different data sources. This makes unit testing easy — inject a mock repository.' },
        { q: 'What is the Result type pattern?', a: 'Instead of throwing exceptions, functions return Result<T, E> = { ok: true, value: T } | { ok: false, error: E }. The caller must handle both cases explicitly. Inspired by Rust\'s Result type.' },
        { q: 'How do you structure a TypeScript project?', a: 'Common structure: src/types (shared types), src/services (business logic), src/repositories (data access), src/controllers (HTTP layer), src/utils (helpers). Group by feature for larger projects.' },
        { q: 'What is Next.js with TypeScript good for?', a: 'Full-stack React with server-side rendering. TypeScript works out of the box. App Router uses server components where you can share types between server and client without an API layer.' },
        { q: 'How do you handle environment variables type-safely?', a: 'Use a schema validation library like zod or envalid to validate process.env at startup. Export a typed env object. If validation fails, the app crashes early with a clear error instead of silently using undefined.' },
      ]
    },
    s21: {
      explain: `TypeScript interview questions range from basic type system concepts to advanced type manipulation. Senior roles expect you to understand the compiler's behavior, write complex utility types, and make architectural decisions. Practice with real coding challenges and code review scenarios.`,
      concepts: ['Common beginner questions', 'Intermediate: generics, utility types', 'Senior: conditional/mapped types', 'System design with TypeScript', 'Code review questions', 'Tricky type puzzles', 'Configuration questions', 'Best practices discussion'],
      code: `<span class="cm">// Classic interview puzzle: type a function</span>
<span class="cm">// that returns same type as input</span>
<span class="kw">function</span> <span class="fn">identity</span><<span class="ty">T</span>>(arg: <span class="ty">T</span>): <span class="ty">T</span> { <span class="kw">return</span> arg; }

<span class="cm">// Flatten array type</span>
<span class="kw">type</span> <span class="ty">Flatten</span><<span class="ty">T</span>> =
  <span class="ty">T</span> <span class="kw">extends</span> (<span class="kw">infer</span> <span class="ty">U</span>)[] ? <span class="ty">Flatten</span><<span class="ty">U</span>> : <span class="ty">T</span>;

<span class="cm">// Get keys of a type where value is a function</span>
<span class="kw">type</span> <span class="ty">MethodKeys</span><<span class="ty">T</span>> = {
  [<span class="ty">K</span> <span class="kw">in keyof</span> <span class="ty">T</span>]: <span class="ty">T</span>[<span class="ty">K</span>] <span class="kw">extends</span> (...args: <span class="ty">any</span>[]) => <span class="ty">any</span>
    ? <span class="ty">K</span>
    : <span class="kw">never</span>
}[<span class="kw">keyof</span> <span class="ty">T</span>];

<span class="cm">// Deep readonly</span>
<span class="kw">type</span> <span class="ty">DeepReadonly</span><<span class="ty">T</span>> = {
  <span class="kw">readonly</span> [<span class="ty">K</span> <span class="kw">in keyof</span> <span class="ty">T</span>]:
    <span class="ty">T</span>[<span class="ty">K</span>] <span class="kw">extends</span> <span class="ty">object</span> ? <span class="ty">DeepReadonly</span><<span class="ty">T</span>[<span class="ty">K</span>]> : <span class="ty">T</span>[<span class="ty">K</span>]
};`,
      useCases: ['Senior frontend/backend engineer interviews', 'TypeScript-focused technical screens', 'System design with type-safe patterns'],
      mistakes: ['Memorizing answers without understanding', 'Ignoring the "why" — explain your reasoning', 'Not knowing tsconfig options (commonly asked)'],
      qa: [
        { q: 'What is structural typing in TypeScript?', a: 'TypeScript uses structural typing ("duck typing") — types are compatible if they have the same shape, not because of explicit inheritance. { name: string, age: number } is compatible with { name: string } because it has all required properties.' },
        { q: 'What is the difference between interface and type alias? (Interview version)', a: 'Both describe object shapes. Interfaces support declaration merging and are preferred for class contracts. Type aliases support unions, intersections, primitives, and advanced types. Interfaces have slightly better error messages.' },
        { q: 'Explain covariance and contravariance in TypeScript.', a: 'Types are covariant in output positions (return types) and contravariant in input positions (parameters). A function with a wider parameter type is assignable to one with a narrower parameter type. TypeScript uses bivariant checking for method parameters (looser).' },
        { q: 'How would you type a deeply nested JSON object?', a: 'Define a recursive type: type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }. This covers all valid JSON values including nested objects and arrays.' },
        { q: 'What is the as const assertion and when do you use it?', a: 'as const makes a value deeply readonly and narrows literal types. const config = { port: 3000 } as const gives config.port type 3000 instead of number. Arrays become readonly tuples. Use for constants and immutable data.' },
      ]
    },
  };

  /* ── Build Sidebar Navigation ───────────────────────────── */
  function buildSidebar() {
    const nav = document.getElementById('nav-list');
    nav.innerHTML = '';
    
    sections.forEach(sec => {
      const done = completed.includes(sec.id);
      const a = document.createElement('a');
      a.className = 'nav-item' + (done ? ' done' : '');
      a.dataset.id = sec.id;
      a.href = '#' + sec.id;
      a.innerHTML = `
        <span class="nav-num">${sec.num}</span>
        <span class="nav-icon ${sec.color}"><i class="${sec.icon}"></i></span>
        <span>${sec.title}</span>
        <span class="nav-check">${done ? '<i class="fas fa-check"></i>' : ''}</span>
      `;
      a.addEventListener('click', e => {
        e.preventDefault();
        scrollToSection(sec.id);
        closeMobileSidebar();
      });
      nav.appendChild(a);
    });
  }

  /* ── Build Main Content ─────────────────────────────────── */
  function buildContent() {
    const container = document.getElementById('sections-container');
    container.innerHTML = '';

    sections.forEach((sec, i) => {
      const content = sectionContent[sec.id];
      const done = completed.includes(sec.id);
      const block = document.createElement('div');
      block.className = 'section-block';
      block.id = sec.id;
      block.style.animationDelay = (i * 0.03) + 's';

      const qa = content.qa.map(q => `
        <div class="qa-item">
          <div class="qa-q"><span>Q: ${q.q}</span><i class="fas fa-chevron-down"></i></div>
          <div class="qa-a"><strong>A:</strong> ${q.a}</div>
        </div>
      `).join('');

      const concepts = content.concepts.map(c => `<li>${c}</li>`).join('');
      const useCases = content.useCases.map(u => `<li>${u}</li>`).join('');
      const mistakes = content.mistakes.map(m => `<li>⚠️ ${m}</li>`).join('');
      const tags = sec.tags.map(t => `<span class="tag">${t}</span>`).join('');

      block.innerHTML = `
        <div class="section-header" data-id="${sec.id}">
          <div class="section-icon ${sec.color}"><i class="${sec.icon}"></i></div>
          <h2>${sec.num}. ${sec.title}</h2>
          <div>${tags}</div>
          <button class="section-complete-btn ${done ? 'done' : ''}" data-id="${sec.id}">
            <i class="fas fa-${done ? 'check-circle' : 'circle'}"></i>
            ${done ? 'Done' : 'Mark Done'}
          </button>
          <button class="section-toggle-btn" aria-label="Toggle section">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        <div class="section-body">
          <div class="section-body-inner">
            <h3>Overview</h3>
            <p>${content.explain}</p>

            <h3>Key Concepts</h3>
            <ul>${concepts}</ul>

            <h3>Code Example</h3>
            <div class="code-block">
              <div class="code-header">
                <span class="code-lang">TypeScript</span>
                <button class="copy-btn"><i class="far fa-copy"></i> Copy</button>
              </div>
              <pre><code>${content.code}</code></pre>
            </div>

            <h3>Real-World Use Cases</h3>
            <ul>${useCases}</ul>

            <h3>Common Mistakes</h3>
            <div class="info-box warn">
              <i class="fas fa-triangle-exclamation"></i>
              <ul style="margin:0;padding-left:1rem">${mistakes}</ul>
            </div>

            <h3>Interview Q&amp;A</h3>
            <div class="qa-list">${qa}</div>
          </div>
        </div>
      `;

      container.appendChild(block);
    });

    // Wire up section events
    wireContentEvents();
  }

  /* ── Build Timeline View ─────────────────────────────────── */
  function buildTimeline() {
    const tl = document.getElementById('timeline-container');
    tl.innerHTML = '';
    const groups = [
      { label: '🚀 Foundation', ids: ['s01','s02','s03','s04','s05'] },
      { label: '🧱 Core Features', ids: ['s06','s07','s08','s09','s10'] },
      { label: '📦 Ecosystem', ids: ['s11','s12','s13','s14','s15'] },
      { label: '⚡ Advanced', ids: ['s16','s17','s18','s19'] },
      { label: '🏆 Mastery', ids: ['s20','s21'] },
    ];

    groups.forEach((g, gi) => {
      const label = document.createElement('div');
      label.className = 'sidebar-section-label';
      label.style.cssText = 'padding-left:0;margin-top:1.5rem';
      label.textContent = g.label;
      tl.appendChild(label);

      const timeline = document.createElement('div');
      timeline.className = 'timeline';

      g.ids.forEach((id, idx) => {
        const sec = sections.find(s => s.id === id);
        const done = completed.includes(id);
        const item = document.createElement('div');
        item.className = 'tl-item ' + (done ? 'done' : '');
        item.style.animationDelay = (gi * 0.1 + idx * 0.05) + 's';
        item.innerHTML = `
          <div class="tl-dot"></div>
          <div class="tl-card" data-id="${id}">
            <h4>
              <span class="tl-badge tag ${done ? 'green' : ''}">${done ? '✓' : sec.num}</span>
              ${sec.title}
            </h4>
            <p>${sec.summary}</p>
          </div>
        `;
        item.querySelector('.tl-card').addEventListener('click', () => {
          switchView('main');
          setTimeout(() => scrollToSection(id), 100);
        });
        timeline.appendChild(item);
      });

      tl.appendChild(timeline);
    });
  }

  /* ── Wire Content Interactions ───────────────────────────── */
  function wireContentEvents() {
    // Section toggle (expand/collapse)
    document.querySelectorAll('.section-header').forEach(header => {
      header.addEventListener('click', e => {
        if (e.target.closest('.section-complete-btn')) return;
        const body = header.nextElementSibling;
        const btn = header.querySelector('.section-toggle-btn');
        body.classList.toggle('open');
        btn.classList.toggle('open');
        header.classList.toggle('active-header');
      });
    });

    // Mark complete buttons
    document.querySelectorAll('.section-complete-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        toggleComplete(id);
      });
    });

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.closest('.code-block').querySelector('code');
        // Strip HTML tags for plain text
        const text = code.innerText || code.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = '<i class="far fa-copy"></i> Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    });

    // Q&A toggles
    document.querySelectorAll('.qa-q').forEach(q => {
      q.addEventListener('click', () => {
        const a = q.nextElementSibling;
        q.classList.toggle('open');
        a.classList.toggle('open');
      });
    });
  }

  /* ── Progress Tracking ───────────────────────────────────── */
  function toggleComplete(id) {
    if (completed.includes(id)) {
      completed = completed.filter(c => c !== id);
    } else {
      completed.push(id);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    updateProgress();
    updateSectionUI(id);
    buildSidebar();
    buildTimeline();
  }

  function updateSectionUI(id) {
    const done = completed.includes(id);
    const btn = document.querySelector(`.section-complete-btn[data-id="${id}"]`);
    if (btn) {
      btn.className = 'section-complete-btn ' + (done ? 'done' : '');
      btn.innerHTML = `<i class="fas fa-${done ? 'check-circle' : 'circle'}"></i> ${done ? 'Done' : 'Mark Done'}`;
    }
    // Update nav item
    const navItem = document.querySelector(`.nav-item[data-id="${id}"]`);
    if (navItem) {
      navItem.classList.toggle('done', done);
      const check = navItem.querySelector('.nav-check');
      if (check) check.innerHTML = done ? '<i class="fas fa-check"></i>' : '';
    }
  }

  function updateProgress() {
    const pct = Math.round((completed.length / sections.length) * 100);
    if (globalPct) globalPct.textContent = pct + '%';
    if (sidebarFill) sidebarFill.style.width = pct + '%';
    if (sidebarPct) sidebarPct.textContent = pct + '%';
  }

  /* ── Search ──────────────────────────────────────────────── */
  function handleSearch(query) {
    if (!query.trim()) {
      searchResults.classList.remove('visible');
      return;
    }
    const q = query.toLowerCase();
    const matches = sections.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.keywords.includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
    if (!matches.length) {
      searchResults.innerHTML = '<div class="sr-item"><span>No results found</span></div>';
    } else {
      searchResults.innerHTML = matches.map(s => `
        <div class="sr-item" data-id="${s.id}">
          <strong>${s.title}</strong><br>
          <span>${s.tags.join(' · ')}</span>
        </div>
      `).join('');
      searchResults.querySelectorAll('.sr-item[data-id]').forEach(item => {
        item.addEventListener('click', () => {
          scrollToSection(item.dataset.id);
          searchResults.classList.remove('visible');
          searchInput.value = '';
          if (currentView === 'timeline') switchView('main');
        });
      });
    }
    searchResults.classList.add('visible');
  }

  /* ── View Switching ──────────────────────────────────────── */
  function switchView(view) {
    currentView = view;
    if (view === 'main') {
      mainView.style.display = 'block';
      timelineView.classList.remove('active');
      timelineBtn.innerHTML = '<i class="fas fa-timeline"></i> <span>Timeline</span>';
    } else {
      mainView.style.display = 'none';
      timelineView.classList.add('active');
      timelineBtn.innerHTML = '<i class="fas fa-list"></i> <span>Sections</span>';
      buildTimeline();
    }
  }

  /* ── Scroll & Active Highlighting ────────────────────────── */
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    // Auto-open section
    const body = el.querySelector('.section-body');
    const btn = el.querySelector('.section-toggle-btn');
    const header = el.querySelector('.section-header');
    if (body && !body.classList.contains('open')) {
      body.classList.add('open');
      if (btn) btn.classList.add('open');
      if (header) header.classList.add('active-header');
    }
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    setActiveNav(id);
  }

  function setActiveNav(id) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const active = document.querySelector(`.nav-item[data-id="${id}"]`);
    if (active) {
      active.classList.add('active');
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  // IntersectionObserver for active section
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  /* ── Mobile Sidebar ──────────────────────────────────────── */
  function closeMobileSidebar() {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    }
  }

  hamburger?.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
  });
  overlay?.addEventListener('click', closeMobileSidebar);

  /* ── Theme Toggle ────────────────────────────────────────── */
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const icon = themeToggle.querySelector('i');
    const span = themeToggle.querySelector('span');
    if (document.body.classList.contains('light')) {
      icon.className = 'fas fa-moon'; if (span) span.textContent = 'Dark';
    } else {
      icon.className = 'fas fa-sun'; if (span) span.textContent = 'Light';
    }
  });

  /* ── Timeline toggle ─────────────────────────────────────── */
  timelineBtn?.addEventListener('click', () => {
    switchView(currentView === 'main' ? 'timeline' : 'main');
  });

  /* ── Back to Top ─────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    backTop?.classList.toggle('visible', window.scrollY > 400);
  });
  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Search events ───────────────────────────────────────── */
  searchInput?.addEventListener('input', e => handleSearch(e.target.value));
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap') && !e.target.closest('#search-results')) {
      searchResults?.classList.remove('visible');
    }
  });

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    buildSidebar();
    buildContent();
    buildTimeline();
    updateProgress();

    // Observe section blocks
    document.querySelectorAll('.section-block').forEach(el => observer.observe(el));

    // Open first section by default
    const firstBody = document.querySelector('.section-body');
    const firstBtn = document.querySelector('.section-toggle-btn');
    const firstHeader = document.querySelector('.section-header');
    if (firstBody) {
      firstBody.classList.add('open');
      if (firstBtn) firstBtn.classList.add('open');
      if (firstHeader) firstHeader.classList.add('active-header');
    }
    setActiveNav('s01');
  }

  // Hide loader
  window.addEventListener('load', () => {
    init();
    setTimeout(() => loader?.classList.add('hidden'), 1600);
  });

})();
