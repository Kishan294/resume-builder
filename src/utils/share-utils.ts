export const shareResume = async (resumeId: string, title: string) => {
  const shareUrl = `${window.location.origin}/resume/${resumeId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${title} - Resume`,
        text: `Check out my resume: ${title}`,
        url: shareUrl,
      });
      return true;
    } catch (error) {
      console.error("Error sharing:", error);
      return false;
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      return false;
    }
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
};

export const generateShareableLink = (resumeId: string): string => {
  return `${window.location.origin}/resume/${resumeId}`;
};
