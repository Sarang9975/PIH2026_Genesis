// Shared helper utilities used across multiple room components.

/**
 * Generic factory for chat messages used in room components.
 *
 * @param {Object} options
 * @param {string} options.text - The message text.
 * @param {string} [options.sender='System'] - Who sent the message.
 * @param {number} [options.id] - Optional id; if omitted will use Date.now().
 */
export function makeChatMessage({ text, sender = 'System', id, timestamp }) {
  return {
    id: id || Date.now(),
    text,
    sender,
    timestamp: timestamp || new Date().toLocaleTimeString()
  };
}

/**
 * Helper for building a caption object for live transcripts.
 */
export function makeCaption(text, speaker = 'Participant', id) {
  return {
    id: id || Date.now() + Math.random(),
    text,
    speaker,
    timestamp: new Date().toLocaleTimeString()
  };
}

/**
 * Check for duplicate transcript entries to prevent echo/duplicate messages.
 *
 * @param {string} text - New transcript text to check.
 * @param {string} excludeSource - Either 'local' or 'remote'; entries from this source are ignored.
 * @param {{current: Array}} recentTranscriptsRef - React ref that holds an array of {text,source,timestamp}.
 * @returns {boolean} true if the text is considered a duplicate of a recent entry.
 */
export function isDuplicate(text, excludeSource, recentTranscriptsRef) {
  if (!recentTranscriptsRef || !recentTranscriptsRef.current) return false;
  const now = Date.now();
  // keep only the last few seconds of entries
  recentTranscriptsRef.current = recentTranscriptsRef.current.filter(t => now - t.timestamp < 5000);

  const normalizedNew = text.toLowerCase().trim();
  return recentTranscriptsRef.current.some(t => {
    if (t.source === excludeSource) return false;
    const normalizedExisting = t.text.toLowerCase().trim();
    if (normalizedNew === normalizedExisting) return true;
    if ((normalizedNew.includes(normalizedExisting) || normalizedExisting.includes(normalizedNew)) &&
        Math.abs(normalizedNew.length - normalizedExisting.length) <= 3) {
      return true;
    }
    return false;
  });
}
