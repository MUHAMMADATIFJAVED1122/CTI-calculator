export const calculateMarks = (req, res) => {
  try {
    const {
      matricObt = 0,
      matricTotal = 1100,
      fscObt = 0,
      fscTotal = 1100,
      bsObt = 0,
      bsTotal = 4600,
      mphilObt = 0,
      mphilTotal = 0,
      higherEdu = 0,        // ✅ NEW for community (0-5)
      system = "community",
      position = 0,
      interview = 0,
    } = req.body;

    // Utility functions
    const toNum = (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? 0 : n;
    };
    const clamp = (v, min, max) => {
      const n = toNum(v);
      return n < min ? min : n > max ? max : n;
    };
    const round2 = (n) => Math.round(n * 100) / 100;

    const calcPerc = (obt, total) => {
      const o = toNum(obt);
      const t = toNum(total);
      if (t <= 0) return 0;
      return clamp((o / t) * 100, 0, 100);
    };

    // Calculate percentages
    const mPerc = calcPerc(matricObt, matricTotal);
    const fPerc = calcPerc(fscObt, fscTotal);
    const bPerc = calcPerc(bsObt, bsTotal);
    const mphilPerc = calcPerc(mphilObt, mphilTotal);

    // Mapping functions (no change)
    const mapBS_community = (p) =>
      p >= 90 ? 55 :
      p >= 80 ? 49.5 :
      p >= 70 ? 44 :
      p >= 60 ? 38.5 : 33;

    const mapFsc_community = (p) =>
      p >= 90 ? 15 :
      p >= 80 ? 13.5 :
      p >= 70 ? 12 :
      p >= 60 ? 10.5 : 9;

    const mapMatric_community = (p) =>
      p >= 90 ? 15 :
      p >= 80 ? 13.5 :
      p >= 70 ? 12 :
      p >= 60 ? 10.5 : 9;

    const mapBS_bs = (p) =>
      p >= 90 ? 25 :
      p >= 80 ? 25 :
      p >= 70 ? 22 :
      p >= 60 ? 18 : 14;

    const mapFsc_bs = (p) =>
      p >= 90 ? 10 :
      p >= 80 ? 8 :
      p >= 70 ? 7 :
      p >= 60 ? 5 : 4;

    const mapMatric_bs = (p) =>
      p >= 90 ? 10 :
      p >= 80 ? 8 :
      p >= 70 ? 7 :
      p >= 60 ? 5 : 4;

    const mapMphil_bs = (p) =>
      p >= 90 ? 20 :
      p >= 80 ? 20 :
      p >= 70 ? 15 :
      p >= 60 ? 12 :
      p >= 50 ? 10 :
      p >= 40 ? 8 : 0;

    const posMarks = clamp(position, 0, 5);
    const intMarks = clamp(interview, 0, 5);
    const higherEduMarks = clamp(higherEdu, 0, 5); // ✅ NEW

    let academicTotal, rawTotal, maxRaw, mphilMarks = 0, finalOutOf100;

    // if (system === "community") {
    //   const bsMarks = mapBS_community(bPerc);
    //   const fscMarks = mapFsc_community(fPerc);
    //   const matricMarks = mapMatric_community(mPerc);

    //   academicTotal = round2(bsMarks + fscMarks + matricMarks + higherEduMarks); // ✅ include higherEdu
    //   rawTotal = round2(academicTotal + posMarks + intMarks);
    //   maxRaw = 85 + 5 + 5; // still out of 85 academic + 5 + 5
    //   finalOutOf100 = round2((rawTotal / maxRaw) * 100);

    // }
    if (system === "community") {
  const bsMarks = mapBS_community(bPerc);
  const fscMarks = mapFsc_community(fPerc);
  const matricMarks = mapMatric_community(mPerc);

  academicTotal = round2(bsMarks + fscMarks + matricMarks + higherEduMarks);
  rawTotal = round2(academicTotal + posMarks + intMarks);

  maxRaw = 85 + 5 + 5; 

  // ❌ Old: finalOutOf100 = (rawTotal / maxRaw) * 100;
  // ✅ New: Just show total marks directly
  finalOutOf100 = rawTotal; 
}

     else {
      const bsMarks = mapBS_bs(bPerc);
      const fscMarks = mapFsc_bs(fPerc);
      const matricMarks = mapMatric_bs(mPerc);
      mphilMarks = mapMphil_bs(mphilPerc);

      academicTotal = round2(bsMarks + fscMarks + matricMarks + mphilMarks);
      rawTotal = round2(academicTotal + posMarks + intMarks);
      maxRaw = 65 + 5 + 5;
      finalOutOf100 = round2((rawTotal / maxRaw) * 100);
    }

    res.json({
      system,
      academicTotal,
      mphilMarks,
      higherEduMarks,  // ✅ return this for frontend display
      position: posMarks,
      interview: intMarks,
      finalMarksOutOf100: finalOutOf100,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
