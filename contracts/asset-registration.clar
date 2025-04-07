;; Asset Registration Contract
;; Records details of heavy machinery

(define-data-var last-asset-id uint u0)

;; Asset structure
(define-map assets
  { asset-id: uint }
  {
    name: (string-ascii 50),
    model: (string-ascii 50),
    manufacturer: (string-ascii 50),
    year: uint,
    serial-number: (string-ascii 50),
    owner: principal,
    available: bool
  }
)

;; Register a new asset
(define-public (register-asset
    (name (string-ascii 50))
    (model (string-ascii 50))
    (manufacturer (string-ascii 50))
    (year uint)
    (serial-number (string-ascii 50)))
  (let ((new-id (+ (var-get last-asset-id) u1)))
    (var-set last-asset-id new-id)
    (map-set assets
      { asset-id: new-id }
      {
        name: name,
        model: model,
        manufacturer: manufacturer,
        year: year,
        serial-number: serial-number,
        owner: tx-sender,
        available: true
      }
    )
    (ok new-id)
  )
)

;; Get asset details
(define-read-only (get-asset (asset-id uint))
  (map-get? assets { asset-id: asset-id })
)

;; Update asset availability
(define-public (set-asset-availability (asset-id uint) (available bool))
  (let ((asset (map-get? assets { asset-id: asset-id })))
    (asserts! (is-some asset) (err u1)) ;; Asset must exist
    (asserts! (is-eq tx-sender (get owner (unwrap-panic asset))) (err u2)) ;; Must be owner

    (map-set assets
      { asset-id: asset-id }
      (merge (unwrap-panic asset) { available: available })
    )
    (ok true)
  )
)

;; Transfer asset ownership
(define-public (transfer-asset (asset-id uint) (new-owner principal))
  (let ((asset (map-get? assets { asset-id: asset-id })))
    (asserts! (is-some asset) (err u1)) ;; Asset must exist
    (asserts! (is-eq tx-sender (get owner (unwrap-panic asset))) (err u2)) ;; Must be owner

    (map-set assets
      { asset-id: asset-id }
      (merge (unwrap-panic asset) { owner: new-owner })
    )
    (ok true)
  )
)

