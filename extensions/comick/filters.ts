export enum FilterControlIds {
  Completed = "checkbox-completed",
  Genres = "multitoggle-genres",
  Demographic = "multitoggle-demographic",
  Country = "multitoggle-country",
  Sort = "sort",
}

export const FIELDS_GENRES = [
  { label: "4-Koma", key: "4-koma" },
  { label: "Action", key: "action" },
  { label: "Adaptation", key: "adaptation" },
  { label: "Adult", key: "adult" },
  { label: "Adventure", key: "adventure" },
  { label: "Aliens", key: "aliens" },
  { label: "Animals", key: "animals" },
  { label: "Anthology", key: "anthology" },
  { label: "Award Winning", key: "award-winning" },
  { label: "Comedy", key: "comedy" },
  { label: "Cooking", key: "cooking" },
  { label: "Crime", key: "crime" },
  { label: "Crossdressing", key: "crossdressing" },
  { label: "Delinquents", key: "delinquents" },
  { label: "Demons", key: "demons" },
  { label: "Doujinshi", key: "doujinshi" },
  { label: "Drama", key: "drama" },
  { label: "Ecchi", key: "ecchi" },
  { label: "Fan Colored", key: "fan-colored" },
  { label: "Fantasy", key: "fantasy" },
  { label: "Full Color", key: "full-color" },
  { label: "Gender Bender", key: "gender-bender" },
  { label: "Genderswap", key: "genderswap" },
  { label: "Ghosts", key: "ghosts" },
  { label: "Gore", key: "gore" },
  { label: "Gyaru", key: "gyaru" },
  { label: "Harem", key: "harem" },
  { label: "Historical", key: "historical" },
  { label: "Horror", key: "horror" },
  { label: "Incest", key: "incest" },
  { label: "Isekai", key: "isekai" },
  { label: "Loli", key: "loli" },
  { label: "Long Strip", key: "long-strip" },
  { label: "Mafia", key: "mafia" },
  { label: "Magic", key: "magic" },
  { label: "Magical Girls", key: "magical-girls" },
  { label: "Martial Arts", key: "martial-arts" },
  { label: "Mature", key: "mature" },
  { label: "Mecha", key: "mecha" },
  { label: "Medical", key: "medical" },
  { label: "Military", key: "military" },
  { label: "Monster Girls", key: "monster-girls" },
  { label: "Monsters", key: "monsters" },
  { label: "Music", key: "music" },
  { label: "Mystery", key: "mystery" },
  { label: "Ninja", key: "ninja" },
  { label: "Office Workers", key: "office-workers" },
  { label: "Official Colored", key: "official-colored" },
  { label: "Oneshot", key: "oneshot" },
  { label: "Philosophical", key: "philosophical" },
  { label: "Police", key: "police" },
  { label: "Post-Apocalyptic", key: "post-apocalyptic" },
  { label: "Psychological", key: "psychological" },
  { label: "Reincarnation", key: "reincarnation" },
  { label: "Reverse Harem", key: "reverse-harem" },
  { label: "Romance", key: "romance" },
  { label: "Samurai", key: "samurai" },
  { label: "School Life", key: "school-life" },
  { label: "Sci-Fi", key: "sci-fi" },
  { label: "Sexual Violence", key: "sexual-violence" },
  { label: "Shota", key: "shota" },
  { label: "Shoujo Ai", key: "shoujo-ai" },
  { label: "Shounen Ai", key: "shounen-ai" },
  { label: "Slice of Life", key: "slice-of-life" },
  { label: "Smut", key: "smut" },
  { label: "Sports", key: "sports" },
  { label: "Superhero", key: "superhero" },
  { label: "Supernatural", key: "supernatural" },
  { label: "Survival", key: "survival" },
  { label: "Thriller", key: "thriller" },
  { label: "Time Travel", key: "time-travel" },
  { label: "Traditional Games", key: "traditional-games" },
  { label: "Tragedy", key: "tragedy" },
  { label: "User Created", key: "user-created" },
  { label: "Vampires", key: "vampires" },
  { label: "Video Games", key: "video-games" },
  { label: "Villainess", key: "villainess" },
  { label: "Virtual Reality", key: "virtual-reality" },
  { label: "Web Comic", key: "web-comic" },
  { label: "Wuxia", key: "wuxia" },
  { label: "Yaoi", key: "yaoi" },
  { label: "Yuri", key: "yuri" },
  { label: "Zombies", key: "zombies" },
];

export const FIELDS_DEMOGRAPHICS = [
  { key: "1", label: "Shounen" },
  { key: "2", label: "Shoujo" },
  { key: "3", label: "Seinen" },
  { key: "4", label: "Josei" },
];

export const FIELDS_COUNTRY = [
  { key: "jp", label: "Manga" },
  { key: "kr", label: "Manhwa" },
  { key: "cn", label: "Manhua" },
];

export const FIELDS_SORT = [
  { key: "follow", label: "Most follows" },
  { key: "view", label: "Most views" },
  { key: "rating", label: "Highest rating" },
  { key: "uploaded", label: "Last updated" },
];
