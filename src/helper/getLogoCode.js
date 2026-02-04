export function getLogoCode(logo_name) {
    const rawMap = {
        "Standard": "GRD-STND",
        "Wordmark Stacked": "GRD-WMSTKD",
        "Stacked": "GRD-STKD",
        "Logomark": "GRD-LM",
        "Wordmark": "GRD-WM",
        "Wordmark Monogram": "GRD-WMMG",
        "Monogram": "GRD-MG",
        "Fleet Solutions": "GRD-FLEET",
        "GRD Fleet Solutions": "GRD-FLEETSOL",
        "Great Dane Establish": "GRD-ESTB",
        "125th": "GRD-125TH",
        "Wordmark (cursive)": "GRD-WMSCRIPT",
        "Elysburg Pennsylvania": "ELYSBURG",
        "Statesboro Georgia": "STATESBORO",
        "Kewanee Illinois": "KEWANEE",
        "Danville Pennsylvania": "DANVILLE",
        "Huntsville Tennessee": "HUNTSVILLE",
        "Jonesboro Arkansas": "JONESBORO",
        "Brazil Indiana": "BRAZIL",
        "Terre Haute Indiana": "TERREHAUTE",
        "Wayne America": "WAYNE",
        "Logomark|Standard": "GRD-LM|GRD-STND",
        "Custom Design": "GRD-CUSTOM",
        "Boost Mobile": "BM",
        "Gen Mobile": "GM",
    };

    const map = Object.fromEntries(
        Object.entries(rawMap).map(([k, v]) => [k.toLowerCase(), v])
    );

    return map[logo_name?.toLowerCase?.()] || null;
}