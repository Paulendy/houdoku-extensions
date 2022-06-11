import {
  GetSeriesFunc,
  GetChaptersFunc,
  GetPageRequesterDataFunc,
  GetPageUrlsFunc,
  GetSearchFunc,
  GetPageDataFunc,
  ExtensionMetadata,
  PageRequesterData,
  GetDirectoryFunc,
  SeriesTagKey,
  ExtensionClientAbstract,
  GetSettingsFunc,
  SetSettingsFunc,
  GetSettingTypesFunc,
  SeriesListResponse,
  SettingType,
  FetchFunc,
  WebviewFunc,
} from "houdoku-extension-lib";
import {
  LanguageKey,
  Series,
  SeriesSourceType,
  SeriesStatus,
} from "houdoku-extension-lib";
import DOMParser from "dom-parser";
import { Response } from "node-fetch";
import metadata from "./metadata.json";
import { parseMetadata } from "../../util/configuring";

const BASE_URL = "https://readcomiconline.li";
export const METADATA: ExtensionMetadata = parseMetadata(metadata);

const TAG_KEY_MAP: {
  [key: string]: SeriesTagKey;
} = {
  Action: SeriesTagKey.ACTION,
  Adventure: SeriesTagKey.ADVENTURE,
  Anthology: SeriesTagKey.ANTHOLOGY,
  Comedy: SeriesTagKey.COMEDY,
  Crime: SeriesTagKey.DRAMA,
  Fantasy: SeriesTagKey.FANTASY,
  Historical: SeriesTagKey.HISTORICAL,
  Horror: SeriesTagKey.HORROR,
  "Martial Arts": SeriesTagKey.MARTIAL_ARTS,
  Military: SeriesTagKey.MILITARY,
  Music: SeriesTagKey.MUSIC,
  Mystery: SeriesTagKey.MYSTERY,
  "Post-Apocalyptic": SeriesTagKey.POST_APOCALYPTIC,
  Psychological: SeriesTagKey.PSYCHOLOGICAL,
  Romance: SeriesTagKey.ROMANCE,
  "School Life": SeriesTagKey.SCHOOL_LIFE,
  "Sci-Fi": SeriesTagKey.SCI_FI,
  "Slice of Life": SeriesTagKey.SLICE_OF_LIFE,
  Sport: SeriesTagKey.SPORTS,
  Superhero: SeriesTagKey.SUPERHERO,
  Supernatural: SeriesTagKey.SUPERNATURAL,
  Thriller: SeriesTagKey.THRILLER,
  Vampires: SeriesTagKey.VAMPIRES,
  "Video Games": SeriesTagKey.VIDEO_GAMES,
  Zombies: SeriesTagKey.ZOMBIES,
};

const SERIES_STATUS_MAP: { [key: string]: SeriesStatus } = {
  Ongoing: SeriesStatus.ONGOING,
  Completed: SeriesStatus.COMPLETED,
};

enum SETTING_NAMES {
  USE_HIGH_QUALITY = "Use high quality images",
}

const SETTING_TYPES = {
  [SETTING_NAMES.USE_HIGH_QUALITY]: SettingType.BOOLEAN,
};

const DEFAULT_SETTINGS = {
  [SETTING_NAMES.USE_HIGH_QUALITY]: true,
};

const getDetailsRowFields = (
  rows: DOMParser.Node[],
  text: string
): string[] => {
  const row = rows.find((row: DOMParser.Node) =>
    row.textContent.includes(text)
  );
  if (!row) return [];

  return row
    .getElementsByTagName("a")!
    .map((node: DOMParser.Node) => node.textContent.trim());
};

const parseDirectoryResponse = (doc: DOMParser.Dom): SeriesListResponse => {
  const rows = doc.getElementsByClassName("section group list")!;
  const hasMore = doc.getElementsByClassName("right_bt next_bt")!.length > 0;

  const seriesList = rows.map((row: DOMParser.Node) => {
    const link = row.getElementsByTagName("a")![0];
    const img = link.getElementsByTagName("img")![0];

    const series: Series = {
      id: undefined,
      extensionId: METADATA.id,
      sourceId: link.getAttribute("href")!.replace("/Comic/", ""),
      sourceType: SeriesSourceType.STANDARD,
      title: img.getAttribute("title")!.trim(),
      altTitles: [],
      description: "",
      authors: [],
      artists: [],
      tagKeys: [],
      status: SeriesStatus.ONGOING,
      originalLanguageKey: LanguageKey.ENGLISH,
      numberUnread: 0,
      remoteCoverUrl: `${BASE_URL}/${img.getAttribute("src")}`,
    };
    return series;
  });

  return {
    seriesList,
    hasMore,
  };
};

export class ExtensionClient extends ExtensionClientAbstract {
  constructor(
    fetchFn: FetchFunc,
    webviewFn: WebviewFunc,
    domParser: DOMParser
  ) {
    super(fetchFn, webviewFn, domParser);
    this.settings = DEFAULT_SETTINGS;
  }

  getMetadata: () => ExtensionMetadata = () => {
    return METADATA;
  };

  getSeries: GetSeriesFunc = (sourceType: SeriesSourceType, id: string) => {
    return this.fetchFn(`${BASE_URL}/Comic/${id}`)
      .then((response: Response) => response.text())
      .then((data: string) => {
        const doc = this.domParser.parseFromString(data);
        const parent = doc.getElementsByClassName("section group")![0];
        const description = doc
          .getElementsByClassName("section group")![1]
          .textContent.trim();

        const img = parent.getElementsByTagName("img")![0];
        const rows = parent.getElementsByTagName("p")!;

        const altNames = getDetailsRowFields(rows, "Other name:");
        const sourceTags = getDetailsRowFields(rows, "Genres:");
        const authors = getDetailsRowFields(rows, "Writer:");
        const artists = getDetailsRowFields(rows, "Artist:");

        const statusRow = rows.find((row: DOMParser.Node) =>
          row.textContent.includes("Status:")
        );
        const statusStr =
          statusRow && false
            ? statusRow!.textContent.replace("Status:&nbsp;", "").trim()
            : "";

        const mapped_tags: SeriesTagKey[] = [];
        sourceTags.forEach((source_tag: string) => {
          if (Object.keys(TAG_KEY_MAP).includes(source_tag)) {
            mapped_tags.push(TAG_KEY_MAP[source_tag]);
          }
        });
        const tagKeys: SeriesTagKey[] = mapped_tags.filter(
          (tag: any) => tag in SeriesTagKey
        );

        const series: Series = {
          extensionId: METADATA.id,
          sourceId: id,
          sourceType: SeriesSourceType.STANDARD,
          title: img.getAttribute("title")!.trim(),
          altTitles: altNames,
          description: description,
          authors: authors,
          artists: artists,
          tagKeys: tagKeys,
          status: SERIES_STATUS_MAP[statusStr] || SeriesStatus.ONGOING,
          originalLanguageKey: LanguageKey.ENGLISH,
          numberUnread: 0,
          remoteCoverUrl: `${BASE_URL}/${img.getAttribute("src")}`,
        };
        return series;
      });
  };

  getChapters: GetChaptersFunc = (sourceType: SeriesSourceType, id: string) => {
    return this.fetchFn(`${BASE_URL}/Comic/${id}`)
      .then((response: Response) => response.text())
      .then((data: string) => {
        const doc = this.domParser.parseFromString(data);
        const parent = doc.getElementsByClassName("section group")![2];
        const rows = parent.getElementsByTagName("li")!;

        return rows.map((row: DOMParser.Node) => {
          const link = row.getElementsByTagName("a")![0];
          const title = link.textContent.trim();
          const chapterNum = title.startsWith("Issue #")
            ? title.split("Issue #")[1]
            : "";

          return {
            id: undefined,
            seriesId: undefined,
            sourceId: link.getAttribute("href")!,
            title: title,
            chapterNumber: chapterNum,
            volumeNumber: "",
            languageKey: LanguageKey.ENGLISH,
            groupName: "",
            time: 0,
            read: false,
          };
        });
      });
  };

  getPageRequesterData: GetPageRequesterDataFunc = (
    sourceType: SeriesSourceType,
    seriesSourceId: string,
    chapterSourceId: string
  ) => {
    const qualityStr = this.settings[SETTING_NAMES.USE_HIGH_QUALITY]
      ? "hq"
      : "lq";

    return this.fetchFn(`${BASE_URL}${chapterSourceId}}&quality=${qualityStr}`)
      .then((response: Response) => response.text())
      .then((data: string) => {
        const snippetRegexp = /lstImages\.push\(\"http.*\)/g;
        const snippets = [...data.matchAll(snippetRegexp)];

        const pageFilenames: string[] = snippets.map((snippet) =>
          snippet.toString().replace('lstImages.push("', "").replace('")', "")
        );

        return {
          server: "",
          hash: "",
          numPages: pageFilenames.length,
          pageFilenames,
        };
      });
  };

  getPageUrls: GetPageUrlsFunc = (pageRequesterData: PageRequesterData) => {
    return pageRequesterData.pageFilenames;
  };

  getPageData: GetPageDataFunc = (series: Series, url: string) => {
    return new Promise((resolve, reject) => {
      resolve(url);
    });
  };

  getDirectory: GetDirectoryFunc = (page: number) => {
    return this.fetchFn(`${BASE_URL}/ComicList/LatestUpdate?page=${page}`)
      .then((response: Response) => response.text())
      .then((data: string) => {
        const doc = this.domParser.parseFromString(data);
        return parseDirectoryResponse(doc);
      });
  };

  getSearch: GetSearchFunc = (
    text: string,
    params: { [key: string]: string },
    page: number
  ) => {
    return this.fetchFn(`${BASE_URL}/AdvanceSearch?page=${page}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: [`comicName=${text}`, "genres=[]", "status="].join("&"),
    })
      .then((response: Response) => response.text())
      .then((data: string) => {
        const doc = this.domParser.parseFromString(data);
        return parseDirectoryResponse(doc);
      });
  };

  getSettingTypes: GetSettingTypesFunc = () => {
    return SETTING_TYPES;
  };

  getSettings: GetSettingsFunc = () => {
    return this.settings;
  };

  setSettings: SetSettingsFunc = (newSettings: { [key: string]: any }) => {
    Object.keys(newSettings).forEach((key: string) => {
      if (
        key in this.settings &&
        typeof (this.settings[key] === newSettings[key])
      ) {
        this.settings[key] = newSettings[key];
      }
    });
  };
}
