import React, { useState } from "react";
import Papa from "papaparse";

const SimpleDuplicateTagger = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [tokenCode, setTokenCode] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  const addLog = (message) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // Simple name normalization (matching processor logic)
  const normalizeName = (firstName, lastName) => {
    const first = (firstName || "")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");
    const last = (lastName || "")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");

    // Only return normalized name if BOTH first and last names exist
    if (!first || !last) {
      return ""; // Return empty string if either name is missing
    }

    return `${first} ${last}`.trim();
  };

  // Calculate information completeness score for a record
  const calculateInformationScore = (record) => {
    let score = 0;

    // Key fields worth more points
    const keyFields = [
      "First Name",
      "Last Name",
      "Email",
      "Personal Email",
      "Phone",
      "Mobile Phone",
      "Home Phone",
      "Work Phone",
      "Address",
      "City",
      "State",
      "Zip Code",
      "Country",
    ];

    // Secondary fields worth fewer points
    const secondaryFields = [
      "Company",
      "Job Title",
      "Website",
      "Birthday",
      "Anniversary",
      "Notes",
      "Lead Source",
      "Tags",
      "Created At",
      "Updated At",
    ];

    // Count key fields (3 points each)
    keyFields.forEach((field) => {
      if (record[field] && record[field].toString().trim()) {
        score += 3;
      }
    });

    // Count secondary fields (1 point each)
    secondaryFields.forEach((field) => {
      if (record[field] && record[field].toString().trim()) {
        score += 1;
      }
    });

    // Bonus for longer text fields (indicates more detailed info)
    const textFields = ["Notes", "Address", "Company"];
    textFields.forEach((field) => {
      if (record[field] && record[field].toString().trim().length > 50) {
        score += 2; // Bonus for detailed text
      }
    });

    return score;
  };

  // God token - never expires, always valid, for admin use
  const GOD_TOKEN = "ADMIN-GOD-TOKEN-NEVER-EXPIRES";

  // Hardcoded valid tokens - you can generate these offline
  const VALID_TOKENS = [
    "TOKEN347-KR8-ACTIVE",
    "BATCH892-ZN4-ACTIVE",
    "PREMIUM158-WQ2-ACTIVE",
    "TEST741-HM9-ACTIVE",
    "DEMO523-FV7-ACTIVE",
    "TOKEN619-XL3-ACTIVE",
    "BATCH274-GP6-ACTIVE",
    "PREMIUM936-BT1-ACTIVE",
    "TEST485-YC5-ACTIVE",
    "DEMO167-JK0-ACTIVE",
    "TOKEN892-DP4-ACTIVE",
    "BATCH531-RW8-ACTIVE",
    "PREMIUM704-MH2-ACTIVE",
    "TEST256-NS7-ACTIVE",
    "DEMO638-AE1-ACTIVE",
    "TOKEN415-VZ9-ACTIVE",
    "BATCH109-LX3-ACTIVE",
    "PREMIUM827-QF6-ACTIVE",
    "TEST964-IU0-ACTIVE",
    "DEMO372-WK5-ACTIVE",
    "TOKEN583-BP8-ACTIVE",
    "BATCH746-YR2-ACTIVE",
    "PREMIUM291-DM7-ACTIVE",
    "TEST809-GN1-ACTIVE",
    "DEMO456-TH4-ACTIVE",
    "TOKEN128-SC9-ACTIVE",
    "BATCH673-PL3-ACTIVE",
    "PREMIUM549-XV6-ACTIVE",
    "TEST932-JW0-ACTIVE",
    "DEMO215-AK5-ACTIVE",
    "TOKEN794-FQ8-ACTIVE",
    "BATCH368-RD2-ACTIVE",
    "PREMIUM082-MZ7-ACTIVE",
    "TEST527-BN1-ACTIVE",
    "DEMO691-HU4-ACTIVE",
    "TOKEN246-VC9-ACTIVE",
    "BATCH913-LP3-ACTIVE",
    "PREMIUM475-YG6-ACTIVE",
    "TEST158-WT0-ACTIVE",
    "DEMO824-JE5-ACTIVE",
    "TOKEN637-PK8-ACTIVE",
    "BATCH491-DR2-ACTIVE",
    "PREMIUM763-XM7-ACTIVE",
    "TEST385-AN1-ACTIVE",
    "DEMO972-SH4-ACTIVE",
    "TOKEN514-FU9-ACTIVE",
    "BATCH259-BW3-ACTIVE",
    "PREMIUM628-QC6-ACTIVE",
    "TEST746-VL0-ACTIVE",
    "DEMO103-IR5-ACTIVE",
    "TOKEN871-MG8-ACTIVE",
    "BATCH432-YP2-ACTIVE",
    "PREMIUM195-DN7-ACTIVE",
    "TEST689-HT1-ACTIVE",
    "DEMO347-JK4-ACTIVE",
    "TOKEN926-SX9-ACTIVE",
    "BATCH564-AZ3-ACTIVE",
    "PREMIUM839-FQ6-ACTIVE",
    "TEST271-RV0-ACTIVE",
    "DEMO715-BM5-ACTIVE",
    "TOKEN458-WE8-ACTIVE",
    "BATCH182-PN2-ACTIVE",
    "PREMIUM607-LC7-ACTIVE",
    "TEST943-YH1-ACTIVE",
    "DEMO526-DU4-ACTIVE",
    "TOKEN369-GR9-ACTIVE",
    "BATCH758-VN3-ACTIVE",
    "PREMIUM421-IW6-ACTIVE",
    "TEST894-MK0-ACTIVE",
    "DEMO652-XP5-ACTIVE",
    "TOKEN137-AE8-ACTIVE",
    "BATCH985-SL2-ACTIVE",
    "PREMIUM314-FT7-ACTIVE",
    "TEST578-QG1-ACTIVE",
    "DEMO289-BZ4-ACTIVE",
    "TOKEN643-HC9-ACTIVE",
    "BATCH826-VU3-ACTIVE",
    "PREMIUM791-JM6-ACTIVE",
    "TEST465-RP0-ACTIVE",
    "DEMO918-DN5-ACTIVE",
    "TOKEN572-YW8-ACTIVE",
    "BATCH394-LK2-ACTIVE",
    "PREMIUM657-PE7-ACTIVE",
    "TEST129-XG1-ACTIVE",
    "DEMO783-AS4-ACTIVE",
    "TOKEN946-FR9-ACTIVE",
    "BATCH218-QN3-ACTIVE",
    "PREMIUM581-VC6-ACTIVE",
    "TEST862-IM0-ACTIVE",
    "DEMO475-HU5-ACTIVE",
    "TOKEN319-BT8-ACTIVE",
    "BATCH937-WL2-ACTIVE",
    "PREMIUM164-YP7-ACTIVE",
    "TEST698-DK1-ACTIVE",
    "DEMO521-GE4-ACTIVE",
    "TOKEN784-MR9-ACTIVE",
    "BATCH453-SZ3-ACTIVE",
    "PREMIUM826-AN6-ACTIVE",
    "TEST237-FV0-ACTIVE",
    "DEMO694-JW5-ACTIVE",
    "TOKEN861-PH8-ACTIVE",
    "BATCH576-QC2-ACTIVE",
    "PREMIUM942-DL7-ACTIVE",
    "TEST419-XT1-ACTIVE",
    "DEMO758-BG4-ACTIVE",
    "TOKEN625-VU9-ACTIVE",
    "BATCH341-IR3-ACTIVE",
    "PREMIUM189-MN6-ACTIVE",
    "TEST973-YK0-ACTIVE",
    "DEMO536-HP5-ACTIVE",
    "TOKEN298-AW8-ACTIVE",
    "BATCH714-SE2-ACTIVE",
    "PREMIUM467-FQ7-ACTIVE",
    "TEST852-RC1-ACTIVE",
    "DEMO163-LZ4-ACTIVE",
    "TOKEN439-DN9-ACTIVE",
    "BATCH987-GT3-ACTIVE",
    "PREMIUM725-VM6-ACTIVE",
    "TEST584-JE0-ACTIVE",
    "DEMO817-PK5-ACTIVE",
    "TOKEN176-XH8-ACTIVE",
    "BATCH629-BU2-ACTIVE",
    "PREMIUM891-QW7-ACTIVE",
    "TEST345-MC1-ACTIVE",
    "DEMO682-YL4-ACTIVE",
    "TOKEN513-AR9-ACTIVE",
    "BATCH956-FN3-ACTIVE",
    "PREMIUM278-DP6-ACTIVE",
    "TEST761-SG0-ACTIVE",
    "DEMO429-HT5-ACTIVE",
    "TOKEN894-IV8-ACTIVE",
    "BATCH132-VK2-ACTIVE",
    "PREMIUM653-BE7-ACTIVE",
    "TEST987-WM1-ACTIVE",
    "DEMO345-QP4-ACTIVE",
    "TOKEN728-JZ9-ACTIVE",
    "BATCH869-LR3-ACTIVE",
    "PREMIUM514-XC6-ACTIVE",
    "TEST623-AN0-ACTIVE",
    "DEMO976-FW5-ACTIVE",
    "TOKEN457-DH8-ACTIVE",
    "BATCH291-SU2-ACTIVE",
    "PREMIUM786-GK7-ACTIVE",
    "TEST138-VT1-ACTIVE",
    "DEMO652-PE4-ACTIVE",
    "TOKEN869-IM9-ACTIVE",
    "BATCH547-YL3-ACTIVE",
    "PREMIUM329-BZ6-ACTIVE",
    "TEST794-QG0-ACTIVE",
    "DEMO418-HN5-ACTIVE",
    "TOKEN631-RC8-ACTIVE",
    "BATCH975-DP2-ACTIVE",
    "PREMIUM182-XW7-ACTIVE",
    "TEST456-AE1-ACTIVE",
    "DEMO729-VK4-ACTIVE",
    "TOKEN947-SU9-ACTIVE",
    "BATCH364-FT3-ACTIVE",
    "PREMIUM698-MH6-ACTIVE",
    "TEST821-JR0-ACTIVE",
    "DEMO513-BN5-ACTIVE",
  ];
  // Used tokens - stored in localStorage to persist across page refreshes
  const [usedTokens, setUsedTokens] = useState(() => {
    try {
      const stored = localStorage.getItem("dupeTagger_usedTokens");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading used tokens from localStorage:", error);
      return [];
    }
  });

  // Validate token code via server API
  const validateToken = async (token) => {
    const trimmedToken = token ? token.trim().toUpperCase() : "";

    if (!trimmedToken) {
      setTokenValid(false);
      return false;
    }

    try {
      const response = await fetch("/api/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: trimmedToken,
          action: "validate",
        }),
      });

      const result = await response.json();
      const isValid = result.valid;

      setTokenValid(isValid);
      return isValid;
    } catch (error) {
      console.error("Token validation error:", error);
      // Fallback to local validation if server is unavailable
      // Check for god token first
      if (trimmedToken === GOD_TOKEN) {
        setTokenValid(true);
        return true;
      }

      const isValidFormat = VALID_TOKENS.includes(trimmedToken);
      const isNotUsed = !usedTokens.includes(trimmedToken);
      const isValid = isValidFormat && isNotUsed;

      setTokenValid(isValid);
      return isValid;
    }
  };

  const handleTokenChange = async (e) => {
    const token = e.target.value;

    // Hidden admin function to clear used tokens
    if (token.toUpperCase() === "RESET-USED-TOKENS-ADMIN") {
      try {
        const response = await fetch("/api/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": prompt("Enter admin key:") || "",
          },
          body: JSON.stringify({
            action: "reset",
          }),
        });

        if (response.ok) {
          setUsedTokens([]);
          localStorage.removeItem("dupeTagger_usedTokens");
          setTokenCode("");
          alert("All used tokens have been reset on server!");
        } else {
          alert("Failed to reset tokens - unauthorized or server error");
        }
      } catch (error) {
        alert("Failed to reset tokens - server error");
      }
      return;
    }

    setTokenCode(token);

    // Debounce the validation to avoid too many API calls
    if (token.trim().length >= 6) {
      setTimeout(() => validateToken(token), 500);
    } else {
      setTokenValid(false);
    }
  };

  const processFile = async () => {
    if (!file || !tokenValid) return;

    setProcessing(true);
    setLogs([]);
    addLog("Starting simple duplicate detection...");

    try {
      const text = await file.text();
      addLog(`File loaded, parsing CSV...`);

      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        encoding: "UTF-8",
      });

      addLog(`Parsed ${parsed.data.length} records`);

      // Group records by normalized name
      const nameGroups = new Map();
      let recordsWithNames = 0;
      let recordsWithoutNames = 0;

      for (let i = 0; i < parsed.data.length; i++) {
        const record = parsed.data[i];
        const normalizedName = normalizeName(
          record["First Name"],
          record["Last Name"]
        );

        if (!normalizedName) {
          recordsWithoutNames++;
          continue;
        }

        recordsWithNames++;

        if (!nameGroups.has(normalizedName)) {
          nameGroups.set(normalizedName, []);
        }
        nameGroups.get(normalizedName).push({
          index: i,
          record: record,
        });
      }

      addLog(`Records with valid names: ${recordsWithNames}`);
      addLog(`Records without valid names: ${recordsWithoutNames}`);
      addLog(`Unique name groups: ${nameGroups.size}`);

      // Process duplicates - create a deep copy to avoid modifying original data
      const processedData = parsed.data.map((record) => ({ ...record }));
      let duplicateGroups = 0;
      let totalDuplicateRecords = 0;
      let masterRecords = 0;
      const duplicateDetails = [];

      for (const [name, records] of nameGroups.entries()) {
        if (records.length > 1) {
          duplicateGroups++;

          // Sort by information completeness - record with most data becomes master
          records.sort((a, b) => {
            const scoreA = calculateInformationScore(a.record);
            const scoreB = calculateInformationScore(b.record);
            return scoreB - scoreA; // Highest score first becomes master
          });

          // Tag ALL records in the group as duplicates (including master)
          for (let j = 0; j < records.length; j++) {
            const recordIndex = records[j].index;
            const record = processedData[recordIndex];

            // Debug: Log what we're about to modify for Lauren records
            if (
              record["First Name"] &&
              record["First Name"].toLowerCase().includes("lauren")
            ) {
              console.log(
                `Before tagging Lauren record at index ${recordIndex}:`,
                {
                  firstName: record["First Name"],
                  lastName: record["Last Name"],
                  name: record["Name"],
                  tags: record["Tags"],
                }
              );
            }

            const existingTags = record["Tags"] || "";
            if (!existingTags.includes("CRM:Duplicate")) {
              record["Tags"] = existingTags
                ? `${existingTags},CRM:Duplicate`
                : "CRM:Duplicate";

              // Add change tracking
              const existingChanges = record["Changes Made"] || "";
              const newChange = "Tagged as CRM:Duplicate";
              record["Changes Made"] = existingChanges
                ? `${existingChanges}; ${newChange}`
                : newChange;
            }
            totalDuplicateRecords++;

            // Debug: Log after modification
            if (
              record["First Name"] &&
              record["First Name"].toLowerCase().includes("lauren")
            ) {
              console.log(
                `After tagging Lauren record at index ${recordIndex}:`,
                {
                  firstName: record["First Name"],
                  lastName: record["Last Name"],
                  name: record["Name"],
                  tags: record["Tags"],
                }
              );
            }
          }

          // Track which one is the master (oldest) for reporting purposes
          const masterIndex = records[0].index;
          masterRecords++;

          // Store details for reporting
          duplicateDetails.push({
            name: name,
            count: records.length,
            masterIndex: masterIndex + 2, // +2 for CSV line number (1-indexed + header)
            duplicateIndexes: records.slice(1).map((r) => r.index + 2),
            records: records.map((r, index) => ({
              line: r.index + 2,
              firstName: r.record["First Name"] || "",
              lastName: r.record["Last Name"] || "",
              email:
                r.record["Email"] || r.record["Personal Email"] || "No email",
              createdAt: r.record["Created At"] || "No date",
              infoScore: calculateInformationScore(r.record),
              isMaster: index === 0,
            })),
          });
        }
      }

      // Sort duplicate groups by count (largest first)
      duplicateDetails.sort((a, b) => b.count - a.count);

      addLog(`\n=== TAGGING COMPLETE ===`);
      addLog(`Duplicate groups found: ${duplicateGroups}`);
      addLog(
        `Total records tagged with CRM:Duplicate: ${totalDuplicateRecords}`
      );
      addLog(
        `Master records (most complete info in each group): ${masterRecords}`
      );

      // Verify tags were applied
      const taggedDuplicates = processedData.filter(
        (r) => r.Tags && r.Tags.includes("CRM:Duplicate")
      ).length;

      addLog(`\n=== VERIFICATION ===`);
      addLog(`Records with CRM:Duplicate tag: ${taggedDuplicates}`);

      setResults({
        originalCount: parsed.data.length,
        processedData: processedData,
        duplicateGroups: duplicateGroups,
        masterRecords: masterRecords,
        duplicateRecords: totalDuplicateRecords,
        taggedDuplicates: taggedDuplicates,
        duplicateDetails: duplicateDetails.slice(0, 20), // Show top 20 groups
        recordsWithNames: recordsWithNames,
        recordsWithoutNames: recordsWithoutNames,
      });

      // Token consumed successfully - invalidate it on server
      const consumedToken = tokenCode.trim().toUpperCase();
      const isGodToken = consumedToken === GOD_TOKEN;

      addLog(`\n=== TOKEN CONSUMED ===`);
      if (isGodToken) {
        addLog(`God token used - token remains valid for future use`);
      } else {
        addLog(`Token "${tokenCode}" has been used and is no longer valid`);
      }

      try {
        // Consume token on server
        const response = await fetch("/api/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: consumedToken,
            action: "consume",
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.isGodToken) {
            addLog(`God token - never expires, always valid`);
          } else {
            addLog(`Token successfully consumed on server`);
          }
        } else {
          addLog(
            `Warning: Token consumption failed on server, but processing completed locally`
          );
        }
      } catch (error) {
        console.error("Error consuming token on server:", error);
        addLog(`Warning: Could not reach server to consume token`);
      }

      // Only mark token as used if it's not the god token
      if (!isGodToken) {
        // Also keep local record as backup
        const newUsedTokens = [...usedTokens, consumedToken];
        setUsedTokens(newUsedTokens);

        try {
          localStorage.setItem(
            "dupeTagger_usedTokens",
            JSON.stringify(newUsedTokens)
          );
        } catch (error) {
          console.error("Error saving used tokens to localStorage:", error);
        }

        setTokenCode("");
        setTokenValid(false);
      } else {
        // Keep the god token in the input for reuse
        addLog(`God token remains in the field for continued use`);
      }
    } catch (error) {
      addLog(`Error: ${error.message}`);
      console.error("Processing error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const csv = Papa.unparse(results.processedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "simple_duplicate_tagged.csv";
    link.click();
  };

  const exportTaggedOnly = () => {
    if (!results) return;

    // Filter to only records that have CRM:Duplicate tag
    const taggedRecords = results.processedData.filter(
      (record) => record.Tags && record.Tags.includes("CRM:Duplicate")
    );

    if (taggedRecords.length === 0) {
      alert("No tagged records found to export!");
      return;
    }

    const csv = Papa.unparse(taggedRecords);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "duplicate_tagged_only.csv";
    link.click();
  };

  const exportMastersAndClean = () => {
    if (!results) return;

    // Get the correct data source (merged if available, otherwise processed)
    const dataSource = results.hasMerged
      ? results.mergedData
      : results.processedData;

    // Filter to master records (CRM:Merged) + all records without duplicate tags
    const cleanRecords = dataSource.filter((record) => {
      const tags = record.Tags || "";
      const hasMerged = tags.includes("CRM:Merged");
      const hasDuplicate = tags.includes("CRM:Duplicate");

      // Include if: has CRM:Merged tag OR has no duplicate-related tags
      return hasMerged || !hasDuplicate;
    });

    if (cleanRecords.length === 0) {
      alert("No master or clean records found to export!");
      return;
    }

    const csv = Papa.unparse(cleanRecords);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "masters_and_clean_records.csv";
    link.click();
  };

  const exportDuplicatesOnly = () => {
    if (!results) return;

    // Get the correct data source (merged if available, otherwise processed)
    const dataSource = results.hasMerged
      ? results.mergedData
      : results.processedData;

    // Filter to only records with CRM:Duplicate tag (excluding masters)
    const duplicateRecords = dataSource.filter((record) => {
      const tags = record.Tags || "";
      return tags.includes("CRM:Duplicate");
    });

    if (duplicateRecords.length === 0) {
      alert("No duplicate records found to export!");
      return;
    }

    const csv = Papa.unparse(duplicateRecords);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "duplicates_only.csv";
    link.click();
  };

  // Extract all emails from a record
  const extractEmails = (record) => {
    const emailFields = [
      "Email",
      "Personal Email",
      "Work Email",
      "Primary Email",
      "Primary Personal Email",
      "Primary Work Email",
      "Email 2",
      "Primary other Email",
      "other Email",
      "Primary Custom Email",
      "Primary personal Email",
      "other Email 2",
      "other Email 3",
      "Primary work Email",
      "work Email",
      "Email 3",
      "Email 4",
      "Email 5",
      "Email 6",
      "work Email 2",
      "Personal Email 2",
      "Personal Email 3",
      "Personal Email 4",
      "home Email",
      "home Email 2",
      "personal Email",
      "other Email 4",
      "Custom Email",
      "Custom Email 2",
      "Obsolete Email",
    ];

    return emailFields
      .map((field) => record[field])
      .filter((email) => email && email.trim() && email.includes("@"))
      .map((email) => email.trim().toLowerCase());
  };

  // Extract all phone numbers from a record
  const extractPhones = (record) => {
    const phoneFields = [
      "Phone",
      "Mobile Phone",
      "Home Phone",
      "Work Phone",
      "Primary Phone",
      "Primary Mobile Phone",
      "Primary Home Phone",
      "Primary Work Phone",
      "Primary Main Phone",
      "Primary Other Phone",
      "Other Phone",
      "Home Phone 2",
      "Other Phone 2",
      "Phone 2",
      "Work Phone 2",
      "Mobile Phone 2",
      "Mobile Phone 3",
      "Main Phone",
      "Custom Phone",
      "Primary Custom Phone",
      "Primary Wife Phone",
      "Primary workMobile Phone",
      "Work_fax Phone",
      "Home_fax Phone",
      "Primary Work_fax Phone",
      "Primary homeFax Phone",
      "Primary Other_fax Phone",
      "Primary Home_fax Phone",
    ];

    return phoneFields
      .map((field) => record[field])
      .filter((phone) => phone && phone.trim())
      .map((phone) => phone.trim().replace(/\D/g, "")) // Remove non-digits for comparison
      .filter((phone) => phone.length >= 10); // Valid phone numbers
  };

  // Merge duplicate records into masters
  const mergeRecords = () => {
    if (!results) return;

    setProcessing(true);
    addLog("\n=== STARTING MERGE PROCESS ===");

    try {
      const mergedData = results.processedData.map((record) => ({ ...record }));
      let mergeCount = 0;
      let masterCount = 0;

      // Group records by normalized name again to process merges
      const nameGroups = new Map();

      for (let i = 0; i < mergedData.length; i++) {
        const record = mergedData[i];
        if (!record.Tags || !record.Tags.includes("CRM:Duplicate")) continue;

        const normalizedName = normalizeName(
          record["First Name"],
          record["Last Name"]
        );
        if (!normalizedName) continue;

        if (!nameGroups.has(normalizedName)) {
          nameGroups.set(normalizedName, []);
        }
        nameGroups.get(normalizedName).push({ index: i, record: record });
      }

      // Process each duplicate group
      for (const [name, records] of nameGroups.entries()) {
        if (records.length <= 1) continue;

        // Sort by information completeness - highest score becomes master
        records.sort((a, b) => {
          const scoreA = calculateInformationScore(a.record);
          const scoreB = calculateInformationScore(b.record);
          return scoreB - scoreA;
        });

        const masterRecord = mergedData[records[0].index];
        const duplicateRecords = records.slice(1);

        addLog(
          `Merging ${duplicateRecords.length} duplicates into master: "${name}"`
        );

        // Debug: Track Robert Abbott specifically
        if (
          name.toLowerCase().includes("robert") &&
          name.toLowerCase().includes("abbott")
        ) {
          console.log("=== ROBERT ABBOTT MERGE DEBUG ===");
          console.log(`Master record index: ${records[0].index}`);
          console.log(`Master record:`, masterRecord);
          console.log(`Duplicate records count: ${duplicateRecords.length}`);
          duplicateRecords.forEach((dup, i) => {
            console.log(`Duplicate ${i + 1} index: ${dup.index}`);
            console.log(`Duplicate ${i + 1} record:`, mergedData[dup.index]);
          });
        }

        // Extract existing data from master
        const masterEmails = extractEmails(masterRecord).map((e) =>
          e.toLowerCase()
        );
        const masterPhones = extractPhones(masterRecord);

        // Merge data from each duplicate into master
        for (const duplicate of duplicateRecords) {
          const dupRecord = mergedData[duplicate.index];

          // Merge emails
          const dupEmails = extractEmails(dupRecord);
          const emailFields = [
            "Personal Email",
            "Email",
            "Work Email",
            "Email 2",
            "Primary other Email",
            "other Email",
            "Primary Custom Email",
            "Primary personal Email",
            "other Email 2",
            "other Email 3",
            "Email 3",
            "Email 4",
            "Email 5",
            "Email 6",
            "work Email 2",
            "Personal Email 2",
            "Personal Email 3",
            "Personal Email 4",
            "home Email",
            "home Email 2",
            "personal Email",
            "other Email 4",
            "Custom Email",
            "Custom Email 2",
          ];

          for (const email of dupEmails) {
            if (!masterEmails.includes(email.toLowerCase())) {
              // Find first empty email field
              for (const field of emailFields) {
                if (!masterRecord[field] || !masterRecord[field].trim()) {
                  masterRecord[field] = email;
                  masterEmails.push(email.toLowerCase());
                  break;
                }
              }
            }
          }

          // Merge phone numbers
          const dupPhones = extractPhones(dupRecord);
          const phoneFields = [
            "Mobile Phone",
            "Home Phone",
            "Work Phone",
            "Primary Other Phone",
            "Other Phone",
            "Home Phone 2",
            "Other Phone 2",
            "Phone 2",
            "Work Phone 2",
            "Mobile Phone 2",
            "Mobile Phone 3",
            "Main Phone",
            "Custom Phone",
            "Primary Custom Phone",
            "Primary Wife Phone",
            "Primary workMobile Phone",
          ];

          for (const phone of dupPhones) {
            if (!masterPhones.includes(phone)) {
              // Find first empty phone field
              for (const field of phoneFields) {
                if (!masterRecord[field] || !masterRecord[field].trim()) {
                  masterRecord[field] = phone;
                  masterPhones.push(phone);
                  break;
                }
              }
            }
          }

          // Merge other fields if master is empty
          const fieldsToMerge = [
            "Company",
            "Title",
            "Notes",
            "Key Background Info",
            "Primary Work Address Line 1",
            "Primary Work Address City",
            "Primary Work Address State",
            "Primary Work Address Zip",
            "Home Address Line 1",
            "Home Address City",
            "Home Address State",
            "Home Address Zip",
            "Team Assigned To",
          ];

          for (const field of fieldsToMerge) {
            if (
              (!masterRecord[field] || !masterRecord[field].trim()) &&
              dupRecord[field] &&
              dupRecord[field].trim()
            ) {
              masterRecord[field] = dupRecord[field];
            }
          }

          // Merge tags (combine unique tags)
          if (dupRecord["Tags"]) {
            const masterTags = (masterRecord["Tags"] || "")
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t);
            const dupTags = dupRecord["Tags"]
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t);
            const allTags = [...new Set([...masterTags, ...dupTags])];
            masterRecord["Tags"] = allTags.join(",");
          }

          mergeCount++;
        }

        // Update master record tags
        const existingTags = (masterRecord["Tags"] || "")
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        const updatedTags = existingTags.filter((t) => t !== "CRM:Duplicate");
        if (!updatedTags.includes("CRM:Merged")) {
          updatedTags.push("CRM:Merged");
        }
        masterRecord["Tags"] = updatedTags.join(",");

        // Add change tracking for merge
        const existingChanges = masterRecord["Changes Made"] || "";
        const newChange = `Merged with ${duplicateRecords.length} duplicate records`;
        masterRecord["Changes Made"] = existingChanges
          ? `${existingChanges}; ${newChange}`
          : newChange;

        masterCount++;
      }

      addLog(`\n=== MERGE COMPLETE ===`);
      addLog(`Master records created: ${masterCount}`);
      addLog(`Duplicate records merged: ${mergeCount}`);

      // Debug: Count Robert Abbott records in final mergedData
      const robertAbbottRecords = mergedData.filter(
        (record) =>
          record["First Name"] &&
          record["Last Name"] &&
          record["First Name"].toLowerCase().includes("robert") &&
          record["Last Name"].toLowerCase().includes("abbott")
      );
      console.log("=== FINAL ROBERT ABBOTT COUNT ===");
      console.log(
        `Found ${robertAbbottRecords.length} Robert Abbott records in mergedData:`
      );
      robertAbbottRecords.forEach((record, i) => {
        console.log(`Robert Abbott ${i + 1}:`, {
          firstName: record["First Name"],
          lastName: record["Last Name"],
          tags: record["Tags"],
          email: record["Email"] || record["Personal Email"],
        });
      });

      // Update results with merged data
      setResults({
        ...results,
        mergedData: mergedData,
        masterCount: masterCount,
        mergeCount: mergeCount,
        hasMerged: true,
      });
    } catch (error) {
      addLog(`Merge error: ${error.message}`);
      console.error("Merge error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const exportMergedResults = () => {
    if (!results || !results.hasMerged) return;

    // Debug: Check what we're about to export
    console.log("=== EXPORT DEBUG ===");
    console.log(`Total records in mergedData: ${results.mergedData.length}`);

    const robertAbbottExportRecords = results.mergedData.filter(
      (record) =>
        record["First Name"] &&
        record["Last Name"] &&
        record["First Name"].toLowerCase().includes("robert") &&
        record["Last Name"].toLowerCase().includes("abbott")
    );

    console.log(
      `Robert Abbott records being exported: ${robertAbbottExportRecords.length}`
    );
    robertAbbottExportRecords.forEach((record, i) => {
      console.log(`Export Robert Abbott ${i + 1}:`, {
        firstName: record["First Name"],
        lastName: record["Last Name"],
        tags: record["Tags"],
        email:
          record["Email"] ||
          record["Personal Email"] ||
          record["Primary Work Email"],
        createdAt: record["Created At"],
      });
    });

    const csv = Papa.unparse(results.mergedData);

    // Debug: Check the CSV output for Robert Abbott
    const csvLines = csv.split("\n");
    const robertLines = csvLines.filter(
      (line) =>
        line.toLowerCase().includes("robert") &&
        line.toLowerCase().includes("abbott")
    );
    console.log(`Robert Abbott lines in CSV: ${robertLines.length}`);
    robertLines.forEach((line, i) => {
      console.log(
        `CSV Robert Abbott line ${i + 1}:`,
        line.substring(0, 200) + "..."
      );
    });

    // Debug: Check for duplicate lines
    const allLines = csv.split("\n");
    console.log(`Total CSV lines: ${allLines.length}`);
    console.log(
      `First few Robert Abbott characters in CSV:`,
      csv.substring(csv.indexOf("Robert"), csv.indexOf("Robert") + 500)
    );

    // Debug: Check if both records are actually different
    const uniqueRobertLines = [...new Set(robertLines)];
    console.log(`Unique Robert Abbott lines: ${uniqueRobertLines.length}`);
    if (uniqueRobertLines.length !== robertLines.length) {
      console.log("WARNING: Duplicate Robert Abbott lines detected!");
      console.log("Original lines:", robertLines.length);
      console.log("Unique lines:", uniqueRobertLines.length);
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "merged_duplicates.csv";
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Removed duplicate title and subtitle since they're in App.jsx */}

      {/* File Upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Upload CSV File
        </h2>

        <div className="space-y-6">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
          />

          {/* Token Input - Only show after file is selected */}
          {file && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="text-blue-800">
                    <p className="font-semibold text-lg mb-2">
                      🔑 Token Required
                    </p>
                    <p className="text-sm mb-4">
                      Enter your processing token to continue. Each token allows
                      you to process one CSV file.
                    </p>
                    {usedTokens.length > 0 && (
                      <p className="text-xs text-blue-600 mt-2">
                        {usedTokens.length} token
                        {usedTokens.length !== 1 ? "s" : ""} used so far
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="token"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Processing Token
                </label>
                <input
                  id="token"
                  type="text"
                  value={tokenCode}
                  onChange={handleTokenChange}
                  placeholder="Enter your processing token (minimum 6 characters)"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-0 ${
                    tokenCode === ""
                      ? "border-gray-300 focus:border-blue-500"
                      : tokenValid
                      ? "border-green-300 bg-green-50 focus:border-green-500"
                      : "border-red-300 bg-red-50 focus:border-red-500"
                  }`}
                />
                {tokenCode && !tokenValid && (
                  <p className="text-sm text-red-600">
                    {usedTokens.includes(tokenCode.trim().toUpperCase())
                      ? "This token has already been used"
                      : "Invalid token - please check your token code"}
                  </p>
                )}
                {tokenValid && (
                  <p className="text-sm text-green-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Valid token - ready to process!
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={processFile}
            disabled={!file || !tokenValid || processing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {!file
                  ? "Select CSV File First"
                  : !tokenValid
                  ? "Enter Valid Token"
                  : "Tag Duplicates"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Processing Logs - Hidden */}
      {/* {logs.length > 0 && (
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Processing Log</h3>
          <div className="text-sm font-mono max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {log}
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Results Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  {results.originalCount}
                </div>
                <div className="text-sm font-semibold text-blue-600">
                  Total Records
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-700 mb-2">
                  {results.duplicateGroups}
                </div>
                <div className="text-sm font-semibold text-emerald-600">
                  Duplicate Groups
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                <div className="text-3xl font-bold text-orange-700 mb-2">
                  {results.duplicateRecords}
                </div>
                <div className="text-sm font-semibold text-orange-600">
                  Total Duplicates
                </div>
              </div>
            </div>
          </div>

          {/* Export Buttons - Commented Out */}
          {/* <div className="text-center space-x-4">
            <button
              onClick={exportResults}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              Export All Records
            </button>
            <button
              onClick={exportTaggedOnly}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Export Tagged Only ({results.taggedDuplicates} records)
            </button>
          </div> */}

          {/* Merge Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Merge Duplicates
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Merge duplicate records into their master records. This will
              consolidate emails, phone numbers, and other data from duplicates
              into the master record with the highest information score. Master
              records are automatically selected based on data completeness
              (most filled fields wins).
            </p>

            {!results.hasMerged ? (
              <div className="space-y-4">
                <div className="bg-amber-100 border border-amber-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start">
                    <div className="text-amber-800">
                      <p className="font-semibold text-lg mb-3">
                        ⚠️ Important Notes:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          Master records will get <strong>CRM:Merged</strong>{" "}
                          tags
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          Duplicate records keep <strong>CRM:Duplicate</strong>{" "}
                          tags
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          Emails, phones, and other data will be consolidated
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          This action cannot be undone in this session
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={mergeRecords}
                    disabled={processing}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Merging...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Merge Duplicates
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-6 mb-6">
                  <div className="text-emerald-800">
                    <p className="font-semibold text-lg mb-3">
                      ✅ Merge Complete!
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        {results.masterCount} master records created with
                        CRM:Merged tags
                      </p>
                      <p className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        {results.mergeCount} duplicate records consolidated
                      </p>
                      <p className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        Data merged: emails, phones, addresses, and other fields
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={exportMergedResults}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center">
                        Export All Merged Data
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                    <button
                      onClick={exportMastersAndClean}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center">
                        Export Masters + Clean
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                    <button
                      onClick={exportDuplicatesOnly}
                      className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center">
                        Export Duplicates Only
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() =>
                        window.open(
                          "https://crmrefresh.org/DupeTaggerDIY",
                          "_blank"
                        )
                      }
                      className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center">
                        Get Another Token
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Duplicate Groups */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Top Duplicate Groups
            </h2>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {results.duplicateDetails.map((group, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-4">
                    {index + 1}. "{group.name}"
                    <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {group.count} records
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {group.records.map((record, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          record.isMaster
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-orange-50 border-orange-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mr-3 ${
                                record.isMaster
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {record.isMaster ? "MASTER" : "DUPLICATE"}
                            </span>
                            <span className="font-medium text-gray-900">
                              Line {record.line}: {record.firstName}{" "}
                              {record.lastName}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Score: {record.infoScore}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Email:</span>{" "}
                          {record.email}
                          {record.createdAt !== "No date" && (
                            <span className="ml-4">
                              <span className="font-medium">Created:</span>{" "}
                              {record.createdAt}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDuplicateTagger;
