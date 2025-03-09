To install dependencies and build your Tauri project, follow these steps:

### **1. Ensure Rust and Cargo Are Installed**
Tauri requires Rust and Cargo. If you haven’t installed them, do so with:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Then restart your terminal and run:

```sh
rustup update
rustup show
```

### **2. Navigate to the `src-tauri` Directory**
Your `Cargo.toml` file is inside `src-tauri`, so move into that directory:

```sh
cd src-tauri
```

### **3. Install Dependencies**
Run the following command inside `src-tauri` to install dependencies from `Cargo.toml`:

```sh
cargo build
```

This will download and compile all Rust dependencies.

### **4. Verify Tauri Installation**
Make sure Tauri is correctly set up:

```sh
cargo tauri info
```

If you don’t have `tauri-cli`, install it globally:

```sh
cargo install tauri-cli
```

### **5. Run Your Tauri App**
Once dependencies are installed, go back to your project root and run:

```sh
pnpm tauri dev
# or
npm run tauri dev
# or
yarn tauri dev
```

This will start your SolidJS frontend inside the Tauri environment.

Let me know if you run into any issues! 🚀