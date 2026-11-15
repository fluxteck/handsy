/**
 * Groups the catalogue's free-form product tags into the filter drawer's
 * Material / Style / Colour sections. Tags are the only attribute the API can
 * filter on besides category and price, so these sections are views over the
 * existing `tags` filter, not new fields.
 *
 * Matching is by lower-cased tag. Anything not listed falls into "More" so a
 * newly added tag is still filterable before someone files it here.
 */
export const TAG_GROUPS = [
    {
        id: "material",
        label: "Material",
        tags: ["acacia wood", "mango wood", "wood", "iron", "metal", "black metal", "brass", "antique brass", "aluminium", "nickel", "ceramic"],
    },
    {
        id: "style",
        label: "Style & Finish",
        tags: ["handcrafted", "hand painted", "engraved", "industrial", "nordic", "mid-century", "retro", "farmhouse", "geometric", "floral", "rust finish", "eco-friendly"],
    },
    {
        id: "color",
        label: "Colour",
        tags: ["black", "matte black", "gold", "blue", "white"],
    },
] as const;

export type TagGroupId = (typeof TAG_GROUPS)[number]["id"] | "more";

const groupByTag = new Map<string, TagGroupId>(
    TAG_GROUPS.flatMap((group) => group.tags.map((tag) => [tag, group.id] as const)),
);

export function tagGroupOf(tag: string): TagGroupId {
    return groupByTag.get(tag.toLowerCase()) ?? "more";
}

/**
 * The API matches products carrying ANY of the selected tags. Within a group
 * that is what a shopper means ("acacia or mango wood"); across groups it
 * would widen the results instead of narrowing them. So picking a tag from a
 * different group replaces the previous selection.
 */
export function toggleTag(selected: string[], tag: string): string[] {
    if (selected.includes(tag)) return selected.filter((t) => t !== tag);
    const group = tagGroupOf(tag);
    return [...selected.filter((t) => tagGroupOf(t) === group), tag];
}
