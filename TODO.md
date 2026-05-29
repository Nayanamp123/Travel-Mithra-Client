# TODO

## Receipt PDF template (exact look)
- [x] Inspect current PDF generation utility (src/utils/receipt.ts)
- [x] Update it to use assets/receipt-reference.png as full-page background in generated PDF
- [x] Ensure the PDF page size remains 595x842 (current MediaBox)
- [ ] Overlay dynamic fields at exact coordinates to match receipt-reference.txt (and receipt-reference.png)
- [ ] Build and verify project builds
- [ ] Spot-check text alignment/escaping and amounts formatting

## Notes
- Generated PDF uses /assets/receipt-reference.png as a full-page background.
- Remaining work is to tune overlay x/y/font sizes for pixel-perfect match.



