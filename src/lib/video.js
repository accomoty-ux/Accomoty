/**
 * THE VIDEO INTERFACE.
 *
 * Five functions. Nothing else in the app knows where video physically
 * lives. Swapping Cloudflare Stream for Bunny, Mux, or your own servers
 * later means writing one new adapter below — no page, player, or
 * component changes.
 *
 * See "Keeping the video decision reversible" in the Plan & Architecture doc.
 */

const CUSTOMER_CODE = import.meta.env.VITE_CF_STREAM_CUSTOMER_CODE;

/* ---------------- Cloudflare Stream adapter ---------------- */
const cloudflareStream = {
  /**
   * Uploads happen server-side: the browser must never hold an API token.
   * Phase 6 replaces this with a call to a Supabase Edge Function that
   * returns a one-time direct-upload URL.
   */
  async uploadVideo() {
    throw new Error('uploadVideo runs in an Edge Function — not implemented until phase 6');
  },

  /**
   * Signed, expiring playback URL. Must be minted server-side after the
   * subscription check, or anyone can share a permanent link.
   */
  async getPlaybackUrl(videoId) {
    if (!videoId) return null;
    // Phase 3: POST to the Edge Function, which verifies access then signs.
    // Until then, return the unsigned URL shape so the player can be built.
    return `https://customer-${CUSTOMER_CODE}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  },

  async getDuration(videoId) {
    if (!videoId) return 0;
    return 0; // Provided by the provider's API once uploads are live.
  },

  async deleteVideo() {
    throw new Error('deleteVideo runs in an Edge Function — not implemented until phase 6');
  },

  async getThumbnail(videoId) {
    if (!videoId) return null;
    return `https://customer-${CUSTOMER_CODE}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
  },
};

/* ---------------- Placeholder adapter ----------------
   Used until Cloudflare is configured, so the player renders
   its real UI with no video attached. */
const placeholder = {
  async uploadVideo() { throw new Error('No video provider configured'); },
  async getPlaybackUrl() { return null; },
  async getDuration() { return 0; },
  async deleteVideo() {},
  async getThumbnail() { return null; },
};

export const video = CUSTOMER_CODE ? cloudflareStream : placeholder;

export const isVideoConfigured = () => Boolean(CUSTOMER_CODE);
