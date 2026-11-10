/**
 * Reserved advertising placement.
 * Leave this node empty until a real ad unit is inserted.
 * Empty slots stay hidden so the page does not show a fake advertisement
 * or ask anyone to click. Adding code here does not mean an ad network
 * has approved the site.
 */
export function AdSlot({ id }) {
  return <div className="ad-slot" data-ad-slot={id} data-ad-format="auto" aria-label="Advertisement" />;
}
