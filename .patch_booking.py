from pathlib import Path

path = Path('frontend/src/components/admin/BookingManagement.tsx')
text = path.read_text(encoding='utf-8')
old = """const handleDelete =
    async (
      id: number,
    ) => {

      await bookingService.deleteBooking(
        id,
      );

      loadBookings();
    };



  return ("""
new = """const handleDelete =
    async (
      id: number,
    ) => {

      await bookingService.deleteBooking(
        id,
      );

      loadBookings();
    };

  const handleDownloadReceipt =
    async (
      id: number,
    ) => {
      try {
        await bookingService.downloadReceipt(id);
      } catch (error) {
        console.error(error)
        alert(\"Receipt download failed\")
      }
    };


  return ("""

if old not in text:
    raise SystemExit('old text not found')

path.write_text(text.replace(old, new), encoding='utf-8')
print('patched')
