export const truncateText = (text: string, maxLength: number = 280): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getInitials = (email: string): string => {
    return email?.[0]?.toUpperCase() || 'U';
};