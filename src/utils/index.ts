/**
 * Creates a URL for the specified page, handling parameters consistently
 * @param pageName The name of the page (e.g., "MemeSound", "Sounds")
 * @param params Object containing parameters (sound_id for MemeSound pages)
 * @returns Properly formatted URL string with language prefix
 */
export function createPageUrl(pageName: string, params: { sound_id?: string; name?: string; [key: string]: any } = {}) {
    const language = localStorage.getItem('selected_language') || 'English';
    const languageLower = language.toLowerCase();
    
    // For MemeSound with a sound ID parameter
    if (pageName === "MemeSound") {
        // Support both params.sound_id (new) and params.name (legacy) for backward compatibility
        const soundIdentifier = params.sound_id || params.name;
        if (soundIdentifier) {
            return `/${languageLower}/memesound/${soundIdentifier}`;
        }
    }
    
    // For Blog with a slug parameter
    if (pageName === "Blog" && params.slug) {
        return `/${languageLower}/blog/${params.slug}`;
    }
    
    // Default case - just the page name
    return `/${languageLower}/${pageName.toLowerCase()}`;
}
