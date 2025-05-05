export function createPageUrl(pageName: string, params: { sound_id?: string; slug?: string; [key: string]: any } = {}) {
    const language = localStorage.getItem('selected_language') || 'English';
    const languageLower = language.toLowerCase();
    
    // Special case for Blog pages - no language prefix
    if (pageName === "Blog" || pageName.toLowerCase() === "blog") {
        if (params.slug) {
            return `/blog/${params.slug}`;
        }
        return '/blog';
    } 
    
    // For MemeSound with a sound ID parameter.
    if (pageName === "MemeSound" || pageName.toLowerCase() === "memesound") {
        const soundIdentifier = params.sound_id || params.name;
        if (soundIdentifier) {
            return `/${languageLower}/memesound/${soundIdentifier}`;
        }
    }
    
    // Default case - language prefixed page
    return `/${languageLower}/${pageName.toLowerCase()}`;
}
