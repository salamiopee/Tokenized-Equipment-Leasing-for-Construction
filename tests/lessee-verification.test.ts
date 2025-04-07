import { describe, it, expect, beforeEach } from "vitest"

// Mock state for the lessee verification contract
let mockState = {
  lastCompanyId: 0,
  companies: new Map(),
  verifiers: new Map(),
  contractOwner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  txSender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
}

// Mock contract functions
const lesseeVerificationContract = {
  registerCompany: (name, address, licenseNumber) => {
    const newId = mockState.lastCompanyId + 1
    mockState.lastCompanyId = newId
    
    mockState.companies.set(newId, {
      name,
      address,
      "license-number": licenseNumber,
      verified: false,
      admin: mockState.txSender,
    })
    
    return { type: "ok", value: newId }
  },
  
  addVerifier: (verifier) => {
    if (mockState.txSender !== mockState.contractOwner) {
      return { type: "err", value: 1 }
    }
    
    mockState.verifiers.set(verifier, { active: true })
    return { type: "ok", value: true }
  },
  
  verifyCompany: (companyId) => {
    const verifierStatus = mockState.verifiers.get(mockState.txSender)
    if (!verifierStatus) return { type: "err", value: 1 }
    if (!verifierStatus.active) return { type: "err", value: 2 }
    
    const company = mockState.companies.get(companyId)
    if (!company) return { type: "err", value: 3 }
    
    company.verified = true
    mockState.companies.set(companyId, company)
    return { type: "ok", value: true }
  },
  
  getCompany: (companyId) => {
    return mockState.companies.get(companyId) || null
  },
  
  isCompanyVerified: (companyId) => {
    const company = mockState.companies.get(companyId)
    return company ? company.verified : false
  },
}

describe("Lessee Verification Contract", () => {
  beforeEach(() => {
    // Reset state before each test
    mockState = {
      lastCompanyId: 0,
      companies: new Map(),
      verifiers: new Map(),
      contractOwner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      txSender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    }
  })
  
  it("should register a new company", () => {
    const result = lesseeVerificationContract.registerCompany(
        "ABC Construction",
        "123 Builder St, Construction City",
        "LIC123456",
    )
    
    expect(result.type).toBe("ok")
    expect(result.value).toBe(1)
    
    const company = lesseeVerificationContract.getCompany(1)
    expect(company).not.toBeNull()
    expect(company.name).toBe("ABC Construction")
    expect(company.address).toBe("123 Builder St, Construction City")
    expect(company["license-number"]).toBe("LIC123456")
    expect(company.verified).toBe(false)
    expect(company.admin).toBe(mockState.txSender)
  })
  
  it("should add a verifier", () => {
    const verifier = "ST2REHHS5J3CERCRBEPMGH7NIV22XCFT1NZTX83F"
    const result = lesseeVerificationContract.addVerifier(verifier)
    
    expect(result.type).toBe("ok")
    expect(result.value).toBe(true)
    
    const verifierStatus = mockState.verifiers.get(verifier)
    expect(verifierStatus).not.toBeUndefined()
    expect(verifierStatus.active).toBe(true)
  })
  
  it("should verify a company", () => {
    // First register a company
    lesseeVerificationContract.registerCompany("XYZ Builders", "456 Construction Ave", "LIC789012")
    
    // Add a verifier
    const verifier = "ST2REHHS5J3CERCRBEPMGH7NIV22XCFT1NZTX83F"
    lesseeVerificationContract.addVerifier(verifier)
    
    // Change tx-sender to the verifier
    mockState.txSender = verifier
    
    // Verify the company
    const result = lesseeVerificationContract.verifyCompany(1)
    expect(result.type).toBe("ok")
    expect(result.value).toBe(true)
    
    // Check that the company is verified
    const isVerified = lesseeVerificationContract.isCompanyVerified(1)
    expect(isVerified).toBe(true)
  })
  
  it("should fail to add verifier if not contract owner", () => {
    // Change tx-sender to someone else
    mockState.txSender = "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5NH9TEBD"
    
    const verifier = "ST2REHHS5J3CERCRBEPMGH7NIV22XCFT1NZTX83F"
    const result = lesseeVerificationContract.addVerifier(verifier)
    
    expect(result.type).toBe("err")
    expect(result.value).toBe(1)
  })
  
  it("should fail to verify company if not a verifier", () => {
    // First register a company
    lesseeVerificationContract.registerCompany("DEF Contractors", "789 Builder Blvd", "LIC345678")
    
    // Change tx-sender to someone who is not a verifier
    mockState.txSender = "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5NH9TEBD"
    
    const result = lesseeVerificationContract.verifyCompany(1)
    expect(result.type).toBe("err")
    expect(result.value).toBe(1)
  })
})

