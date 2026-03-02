##  CertVerify – Decentralized Certificate Verification dApp

CertVerify is a complete end-to-end mini-dApp built using **Stellar Soroban smart contracts** and a **React + TypeScript frontend** to register and verify certificate hashes on-chain.

This project demonstrates a full Web3 workflow including smart contract development, testing, frontend integration, wallet signing, caching, deployment, and blockchain verification.

---

##  Project Overview

CertVerify allows users to:

- Upload a certificate file (.pdf, .png, .jpg)
- Automatically generate a SHA-256 hash of the file
- Register the hash on Stellar Testnet via a Soroban smart contract
- Verify certificate authenticity directly from the blockchain
- View transaction proof on Stellar Expert Explorer
- Experience loading states and local caching for improved UX

The goal is to ensure certificate integrity, immutability, and decentralized verification using blockchain technology.

---

## Tech Stack

## Smart Contract
- Rust
- Soroban SDK v25
- Stellar Testnet

##  Frontend
- React 19
- Vite
- TypeScript
- @stellar/stellar-sdk
- @stellar/freighter-api
- crypto-js (SHA-256)

##  Wallet
- Freighter Wallet (Testnet)

##  Deployment
-Vercel (Production Build)

---

##  Project Structure

certificate-verifier/
│
├── src/
│   └── lib.rs                     # Soroban smart contract
│
├── certificate-frontend/
│   ├── src/
│   │   └── App.tsx                # React frontend
│   ├── package.json
│   └── vite.config.ts
│
├── Cargo.toml
└── README.md

---

##  Smart Contract

Contract Name: `CertificateVerifier`

### Functions

#### register_certificate(hash: BytesN<32>, user: Address)
Stores the certificate hash on-chain linked to a user address.

#### verify_certificate(hash: BytesN<32>) -> bool
Checks if the certificate hash exists in contract storage.

### Testing

This project includes 3+ unit tests:

- Register certificate successfully
- Verify existing certificate
- Verify non-existing certificate

Run tests using:

cargo test

All tests pass successfully.

---

##  Contract Testing

This project includes 3 unit tests:

1. Test registering a certificate
2. Test verifying an existing certificate
3. Test verifying a non-existing certificate

## Run Tests

From project root:

cargo test

## Expected Output

running 3 tests  
test result: ok. 3 passed; 0 failed  

“The contract includes 3 unit tests verifying registration and validation logic.”
---

# Running the Frontend

## 1️ Navigate to Frontend Folder

cd certificate-frontend

## 2️ Install Dependencies

npm install

## 3️ Start Development Server

npm run dev

App runs at:

http://localhost:5173

Open this URL in your browser.

---

##  How to Use the Application

1. Click Connect Freighter
2. Approve connection in Freighter Wallet (Testnet)
3. Upload a certificate file (.pdf, .png, .jpg)
4. SHA-256 hash is generated automatically
5. Click Register to store hash on-chain
6. Confirm transaction in Freighter
7. View transaction on Stellar Explorer
8. Click Verify to confirm certificate validity

---

##  Live Demo

Live Application:  


https://certverify-soroban-dapp-f9wagp083-nayanpalande21s-projects.vercel.app

---

##  Example On-Chain Transaction

After registering a certificate, a transaction hash is generated.

You can view it on:

https://stellar.expert/explorer/testnet/tx/1202ac4435c3fda6a9ac32f32166048234069f68c4a6cf70aefd76310f037e84

Hash: 1202ac4435c3fda6a9ac32f32166048234069f68c4a6cf70aefd76310f037e84

---

##  Features Implemented

✔ Complete end-to-end mini-dApp  
✔ Soroban smart contract deployed on Testnet  
✔ 3+ unit tests passing  
✔ Wallet connection (Freighter)  
✔ SHA-256 file hashing  
✔ On-chain certificate registration  
✔ On-chain certificate verification  
✔ Loading states & progress indicators  
✔ Button disabling during transactions  
✔ Explorer transaction link  
✔ Basic caching using localStorage  
✔ Wallet auto-restore on refresh  
✔ Clean project structure  
✔ Meaningful Git commits  

---

##  How It Works

1. User uploads certificate file  
2. SHA-256 hash is generated in frontend  
3. User signs transaction using Freighter  
4. Smart contract stores hash on-chain  
5. Verification checks contract storage  
6. Result displayed to user  
7. Result cached locally for faster repeat verification  

---

##  Deployment

The frontend is deployed on Vercel using a production build.

Steps:
1. Run `npm run build`
2. Deploy using Vercel
3. Root directory set to `certificate-frontend`
4. Application preset: Vite

Live Application:
https://certverify-soroban-dapp-f9wagp083-nayanpalande21s-projects.vercel.app

---

##  Demo Video



The demo shows:
- Wallet connection  
- File upload & hash generation  
- On-chain registration  
- Explorer verification  
- On-chain validation  

---


## License

MIT

