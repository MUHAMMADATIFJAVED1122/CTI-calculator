import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Ensure Bootstrap is loaded
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { School } from "@mui/icons-material";

const Calculator = () => {
  const [form, setForm] = useState({
    matricObt: "",
    matricTotal: "",
    fscObt: "",
    fscTotal: "",
    bsObt: "",
    bsTotal: "",
    mphilObt: "",
    mphilTotal: "",
    system: "community",
    higherEdu: "",
    position: "",
    interview: "",
  });

  const [percentages, setPercentages] = useState({
    matric: 0,
    fsc: 0,
    bs: 0,
    mphil: 0,
  });

  const [result, setResult] = useState(null);

  const calcPercentage = (obt, total) => {
    const o = Number(obt);
    const t = Number(total);
    if (!t || t <= 0) return 0;
    const perc = (o / t) * 100;
    return perc > 100 ? 100 : perc < 0 ? 0 : perc;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name.includes("matric"))
        setPercentages((p) => ({
          ...p,
          matric: calcPercentage(updated.matricObt, updated.matricTotal).toFixed(
            2
          ),
        }));
      if (name.includes("fsc"))
        setPercentages((p) => ({
          ...p,
          fsc: calcPercentage(updated.fscObt, updated.fscTotal).toFixed(2),
        }));
      if (name.includes("bs"))
        setPercentages((p) => ({
          ...p,
          bs: calcPercentage(updated.bsObt, updated.bsTotal).toFixed(2),
        }));
      if (name.includes("mphil"))
        setPercentages((p) => ({
          ...p,
          mphil: calcPercentage(updated.mphilObt, updated.mphilTotal).toFixed(2),
        }));

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/calculate",
        form
      );
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error calculating marks. Please check your backend.");
    }
  };

  return (
    <div className="container mt-4">
      {/* ✅ Always Visible Header */}
      {/* <div
        className="text-center p-3 rounded shadow mb-4 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "#0d6efd", // Bootstrap primary color fallback
          color: "white",
        }}
      >
        <School className="me-2" fontSize="large" />
        <h2 className="m-0">CTI Merit Calculator</h2>
      </div> */}
{/* ✅ Always Visible Header */}
<div
  className="text-center p-3 rounded shadow mb-4 d-flex flex-column justify-content-center align-items-center"
  style={{
    backgroundColor: "#0d6efd", // Bootstrap primary blue
    color: "white",
  }}
>
  <School fontSize="large" />
  <h2 className="m-0 fw-bold">CTI Merit Calculator</h2>
  <p className="m-0" style={{ fontSize: "1rem", fontWeight: "500" }}>
    Calculate merit for BS & Community Colleges
  </p>
</div>

      <Card className="shadow-lg rounded-3">
        <CardHeader
          title={<span className="fw-bold text-primary">Enter Your Details</span>}
          subheader="Fill in the fields to calculate your final merit"
        />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* System Selection */}
            <select
              name="system"
              value={form.system}
              onChange={handleChange}
              className="form-select mb-3"
            >
              <option value="community">Community / General College</option>
              <option value="bs">BS College</option>
            </select>

            {/* Academic Sections */}
            {["Matric", "FSc", "BS"].map((label, idx) => {
              const name = label.toLowerCase();
              return (
                <Card key={idx} className="mb-3 border">
                  <CardHeader title={label + " Details"} />
                  <CardContent>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <input
                          type="number"
                          name={`${name}Obt`}
                          value={form[`${name}Obt`]}
                          onChange={handleChange}
                          placeholder="Obtained"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="number"
                          name={`${name}Total`}
                          value={form[`${name}Total`]}
                          onChange={handleChange}
                          placeholder="Total"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          value={`${percentages[name]}%`}
                          readOnly
                          className="form-control text-center bg-light"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* ✅ MS/MPhil Section (Only for BS System) */}
            {form.system === "bs" && (
              <Card className="mb-3 border border-info">
                <CardHeader title="MS / M.Phil Details" />
                <CardContent>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input
                        type="number"
                        name="mphilObt"
                        value={form.mphilObt}
                        onChange={handleChange}
                        placeholder="Obtained"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        name="mphilTotal"
                        value={form.mphilTotal}
                        onChange={handleChange}
                        placeholder="Total"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        value={`${percentages.mphil}%`}
                        readOnly
                        className="form-control text-center bg-light"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ✅ Higher Education (Only for Community) */}
            {form.system === "community" && (
              <div className="mb-3">
                <label className="fw-bold">Higher Education Marks (0-5):</label>
                <input
                  type="number"
                  name="higherEdu"
                  value={form.higherEdu || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Optional"
                />
              </div>
            )}

            {/* Position & Interview */}
            {["position", "interview"].map((field, i) => (
              <div key={i} className="mb-3">
                <label className="fw-bold">
                  {field.charAt(0).toUpperCase() + field.slice(1)} Marks (0-5):
                </label>
                <input
                  type="number"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Optional"
                />
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold py-2"
            >
              Calculate Merit
            </button>
          </form>

          {/* Results */}
          {result && (
            <div className="alert alert-success mt-4 shadow-sm">
              <Typography variant="h6" className="fw-bold text-success">
                Result
              </Typography>
              <p>Academic Total: {result.academicTotal}</p>
              {form.system === "bs" && (
                <p>MS/M.Phil Marks: {result.mphilMarks}</p>
              )}
              <p>Position: {result.position}</p>
              <p>Interview: {result.interview}</p>
              <p className="fw-bold fs-5 text-success">
                Final Merit: {result.finalMarksOutOf100} / 100
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
