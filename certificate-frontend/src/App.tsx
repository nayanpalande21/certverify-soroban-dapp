import { useState } from "react";
import { Buffer } from "buffer";
import { StrKey } from "@stellar/stellar-sdk";
import { getAddress, signTransaction } from "@stellar/freighter-api";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import {
  Contract,
  Networks,
  rpc,
  TransactionBuilder,
  BASE_FEE,
  xdr,
} from "@stellar/stellar-sdk";

const CONTRACT_ID =
  "CD6Y4Y6PVELIFPELVQY74C4MH63RFAVP3EJLLW54X7QPFCURNTSEFP4U";

const server = new rpc.Server("https://soroban-testnet.stellar.org");


const styles = `
body {
  margin: 0;
  background: #040b1a;
  font-family: 'Inter', sans-serif;
  color: #eaf4ff;
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,150,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,150,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.card {
  width: 580px;
  background: rgba(8, 20, 45, 0.9);
  border: 1px solid rgba(0,150,255,0.2);
  border-radius: 28px;
  padding: 55px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 120px rgba(0,100,255,0.15);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 45px;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg,#008cff,#0055ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 0 40px rgba(0,150,255,0.6);
}

.title {
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  font-size: 12px;
  color: #00aaff;
  margin-top: 4px;
  letter-spacing: 1px;
}

.badge {
  padding: 7px 16px;
  border-radius: 22px;
  font-size: 11px;
  border: 1px solid rgba(0,150,255,0.4);
  color: #00aaff;
}

.section {
  margin-bottom: 32px;
}

.label {
  font-size: 11px;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 10px;
}

.box,
.input {
  width: 100%;
  height: 60px;
  padding: 0 20px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  font-size: 14px;
  box-sizing: border-box;
}

.box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(0,150,255,0.25);
  cursor: pointer;
  transition: 0.3s;
}

.box:hover {
  border-color: #00aaff;
  box-shadow: 0 0 20px rgba(0,150,255,0.2);
}

.wallet-address {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.dot {
  width: 9px;
  height: 9px;
  background: #00ff99;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff99;
}

.input-wrap {
  position: relative;
}

.input {
  border: 1px solid rgba(0,150,255,0.25);
  background: rgba(255,255,255,0.03);
  color: #fff;
  outline: none;
}

.input:focus {
  border-color: #00aaff;
  box-shadow: 0 0 15px rgba(0,150,255,0.3);
}

.char-count {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}

.char-count.valid {
  color: #00ff99;
}

.buttons {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.verify-btn,
.register-btn {
  flex: 1;
  height: 60px;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.verify-btn {
  background: transparent;
  border: 1px solid #00aaff;
  color: #00aaff;
}

.verify-btn:hover {
  background: rgba(0,150,255,0.1);
  box-shadow: 0 0 25px rgba(0,150,255,0.3);
}

.register-btn {
  border: none;
  background: linear-gradient(135deg,#0055ff,#00aaff);
  color: #fff;
  box-shadow: 0 0 40px rgba(0,100,255,0.6);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 60px rgba(0,100,255,0.8);
}

.success-box {
  margin-top: 30px;
  padding: 22px;
  border-radius: 18px;
  background: rgba(0,255,150,0.07);
  border: 1px solid rgba(0,255,150,0.4);
  color: #00ff99;
}

.footer {
  margin-top: 45px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: 12px;
  color: rgba(255,255,255,0.3);
}
`;
function App() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [hash, setHash] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidHash = /^[0-9a-fA-F]{64}$/.test(hash);
  
    

  // ---------------- CONNECT WALLET ----------------
  async function connectWallet() {
    try {
      const response = await getAddress();
      if (response.error) return alert(response.error);
      setPublicKey(response.address);
    } catch {
      alert("Freighter not installed or locked.");
    }
  }

  // ---------------- FILE UPLOAD ----------------
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const hexString = Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const fileHash = SHA256(Hex.parse(hexString)).toString();
    setHash(fileHash);
  }

  // ---------------- REGISTER ----------------
  async function registerCertificate() {
    if (!publicKey) return alert("Connect wallet first");
    if (!isValidHash) return alert("Enter valid 64-character hex string");

    setLoading(true);
    setResult(null);
    setTxHash(null);

    try {
      const account = await server.getAccount(publicKey);
      const contract = new Contract(CONTRACT_ID);

      const bytes = new Uint8Array(
        hash.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
      );

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            "register_certificate",
           xdr.ScVal.scvBytes(Buffer.from(bytes)),
            xdr.ScVal.scvAddress(
              xdr.ScAddress.scAddressTypeAccount(
                xdr.PublicKey.publicKeyTypeEd25519(
                  StrKey.decodeEd25519PublicKey(publicKey)
                )
              )
            )
          )
        )
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);
      const prepared = rpc.assembleTransaction(tx, sim).build();

      const signed = await signTransaction(prepared.toXDR(), {
        networkPassphrase: Networks.TESTNET,
      });

      const txResponse = await server.sendTransaction(
        TransactionBuilder.fromXDR(
          signed.signedTxXdr,
          Networks.TESTNET
        )
      );

      setResult("Certificate Registered ✅");
      setTxHash(txResponse.hash);
    } catch (err) {
      console.error(err);
      setResult("Error registering certificate");
    }

    setLoading(false);
  }

  // ---------------- VERIFY ----------------
  async function verifyCertificate() {
    if (!publicKey) return alert("Connect wallet first");
    if (!isValidHash) return alert("Enter valid 64-character hex string");

    setLoading(true);
    setResult(null);

    try {
      const account = await server.getAccount(publicKey);
      const contract = new Contract(CONTRACT_ID);

      const bytes = new Uint8Array(
        hash.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
      );

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            "verify_certificate",
           xdr.ScVal.scvBytes(Buffer.from(bytes))
          )
        )
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);
     const scVal =
  (sim as any).result?.retval ||
  (sim as any).results?.[0]?.retval;

      if (!scVal) return setResult("No response from contract");

      const value = scVal.b();
      setResult(value ? "Certificate Valid ✅" : "Not Found ❌");
    } catch (err) {
      console.error(err);
      setResult("Error verifying certificate");
    }

    setLoading(false);
  }

  return (
  <>
    <style>{styles}</style>
    <div className="bg-grid" />

    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card">

       <div className="header">
  <div className="logo-wrap">
    <div className="logo-icon">🔐</div>
    <div>
      <div className="title">CertVerify</div>
      <div className="subtitle">STELLAR · SOROBAN</div>
    </div>
  </div>
  <div className="badge">TESTNET</div>
</div>

        <div className="section">
  <div className="label">WALLET</div>
  {!publicKey ? (
    <div className="box" onClick={connectWallet}>
      🔗 Connect Freighter
    </div>
  ) : (
   <div className="box wallet-box">
  <div className="dot" />
  <span className="wallet-address">
    {publicKey}
  </span>
</div>
  )}
</div>
       

        <div className="section">
  <div className="label">UPLOAD CERTIFICATE</div>
  <label className="box">
    📄 Choose file to auto-hash (.pdf, .png, .jpg)
    <input type="file" hidden accept=".pdf,.png,.jpg" onChange={handleFileUpload} />
  </label>
</div>

        <div className="section">
          <div className="label">CERTIFICATE HASH</div>
          <div className="input-wrap">
            <input
              className="input"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="64-character hex string"
            />
            <div className={`char-count ${isValidHash ? "valid" : ""}`}>
              {hash.length}
            </div>
          </div>
        </div>

       <div className="buttons">
  <button
    className="verify-btn"
    onClick={verifyCertificate}
    disabled={loading}
  >
    {loading ? "Processing..." : "Verify"}
  </button>

  <button
    className="register-btn"
    onClick={registerCertificate}
    disabled={loading}
  >
    {loading ? "Processing..." : "Register"}
  </button>
</div>

        {result && (
          <div className="success-box">
            {result}
            {txHash && (
              <div style={{ marginTop: 8 }}>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00ccff", fontSize: 12 }}
                >
                  View on Explorer →
                </a>
              </div>
            )}
          </div>
        )}

        <div className="footer">
          DECENTRALIZED · ON-CHAIN
        </div>

      </div>
    </div>
  </>
);
}

export default App;