import { toast } from "sonner";

/**
 * Copy text to the clipboard and confirm with a toast. Falls back to a
 * temporary textarea for older browsers / non-secure contexts.
 */
export async function copyCode(code: string, label = "Copied!") {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
      toast.success(label);
      return;
    }
    throw new Error("clipboard API unavailable");
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success(label);
    } catch {
      toast.error("Couldn't copy — select the code and copy manually");
    }
  }
}
