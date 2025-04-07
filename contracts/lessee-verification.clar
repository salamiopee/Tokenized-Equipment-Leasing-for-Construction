;; Lessee Verification Contract
;; Validates qualified construction companies

;; Company verification status
(define-data-var last-company-id uint u0)

;; Company structure
(define-map companies
  { company-id: uint }
  {
    name: (string-ascii 100),
    address: (string-ascii 100),
    license-number: (string-ascii 50),
    verified: bool,
    admin: principal
  }
)

;; Verifiers who can approve companies
(define-map verifiers
  { address: principal }
  { active: bool }
)

;; Initialize contract with contract deployer as verifier
(define-data-var contract-owner principal tx-sender)

;; Register a new company
(define-public (register-company
    (name (string-ascii 100))
    (address (string-ascii 100))
    (license-number (string-ascii 50)))
  (let ((new-id (+ (var-get last-company-id) u1)))
    (var-set last-company-id new-id)
    (map-set companies
      { company-id: new-id }
      {
        name: name,
        address: address,
        license-number: license-number,
        verified: false,
        admin: tx-sender
      }
    )
    (ok new-id)
  )
)

;; Add a verifier
(define-public (add-verifier (verifier principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) (err u1)) ;; Only contract owner can add verifiers
    (map-set verifiers { address: verifier } { active: true })
    (ok true)
  )
)

;; Verify a company
(define-public (verify-company (company-id uint))
  (let ((verifier-status (map-get? verifiers { address: tx-sender }))
        (company (map-get? companies { company-id: company-id })))
    (asserts! (is-some verifier-status) (err u1)) ;; Must be a verifier
    (asserts! (get active (unwrap-panic verifier-status)) (err u2)) ;; Verifier must be active
    (asserts! (is-some company) (err u3)) ;; Company must exist

    (map-set companies
      { company-id: company-id }
      (merge (unwrap-panic company) { verified: true })
    )
    (ok true)
  )
)

;; Get company details
(define-read-only (get-company (company-id uint))
  (map-get? companies { company-id: company-id })
)

;; Check if company is verified
(define-read-only (is-company-verified (company-id uint))
  (match (map-get? companies { company-id: company-id })
    company (get verified company)
    false
  )
)

