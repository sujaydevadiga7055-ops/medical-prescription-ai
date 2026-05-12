import { useState } from "react";
import axios from "axios";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [correctedMedicine, setCorrectedMedicine] = useState("");
  const [medicineInfo, setMedicineInfo] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {

    const file = event.target.files[0];

    setSelectedFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const analyzePrescription = async () => {

    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/analyze",
        formData
      );

      setPrediction(response.data.prediction);

      setCorrectedMedicine(
        response.data.corrected_medicine
      );

      setMedicineInfo(
        response.data.medicine_info
      );

    } catch (error) {

      console.error(error);
      alert("Error analyzing prescription.");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px",
        fontFamily: "Inter, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >

      {/* MAIN CONTAINER */}

      <div
        style={{
          width: "100%",
          maxWidth: "1220px",
          background: "#ffffff",
          borderRadius: "24px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 0.9fr",
          boxShadow: "0 15px 50px rgba(0,0,0,0.08)",
        }}
      >

        {/* LEFT SECTION */}

        <div
          style={{
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >

          {/* BADGE */}

          <div
            style={{
              background: "#dbeafe",
              color: "#2563eb",
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "18px",
            }}
          >
            Medical Intelligence Platform
          </div>

          {/* TITLE */}

          <h1
            style={{
              fontSize: "44px",
              lineHeight: "1",
              fontWeight: "800",
              color: "#020617",
              textAlign: "center",
              marginBottom: "18px",
              letterSpacing: "-1px",
            }}
          >
            Prescription
            <br />
            Analyzer
          </h1>

          {/* DESCRIPTION */}

          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.8",
              color: "#475569",
              textAlign: "center",
              maxWidth: "480px",
              marginBottom: "24px",
            }}
          >
            Transform handwritten prescriptions into
            structured digital medical insights with
            intelligent prescription recognition.
          </p>

          {/* LOADING */}

          {loading && (

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                padding: "22px",
                borderRadius: "18px",
                width: "300px",
                textAlign: "center",
              }}
            >

              <div
                style={{
                  width: "45px",
                  height: "45px",
                  border: "4px solid #dbeafe",
                  borderTop: "4px solid #2563eb",
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  animation: "spin 1s linear infinite",
                }}
              />

              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                Processing Prescription
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  lineHeight: "1.7",
                }}
              >
                OCR engine is extracting
                handwritten medical text.
              </p>

            </div>
          )}

          {/* RESULTS */}

          {prediction && !loading && (

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "18px",
                width: "100%",
              }}
            >

              {/* IMAGE */}

              {preview && (

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "10px",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.05)",
                  }}
                >

                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: "170px",
                      borderRadius: "12px",
                      display: "block",
                    }}
                  />

                </div>
              )}

              {/* RESULT CARD */}

              <div
                style={{
                  width: "300px",
                  background: "#ffffff",
                  border: "1px solid #dbeafe",
                  borderRadius: "18px",
                  padding: "18px",
                  boxShadow:
                    "0 8px 25px rgba(37,99,235,0.08)",
                }}
              >

                {/* TOP */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "18px",
                  }}
                >

                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    Analysis Result
                  </h3>

                  <div
                    style={{
                      background: "#dcfce7",
                      color: "#166534",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    OCR Complete
                  </div>

                </div>

                {/* OCR */}

                <p
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    textAlign: "center",
                    marginBottom: "6px",
                  }}
                >
                  OCR Extracted Text
                </p>

                <h2
                  style={{
                    fontSize: "26px",
                    color: "#2563eb",
                    textAlign: "center",
                    fontWeight: "800",
                    marginBottom: "16px",
                  }}
                >
                  {prediction}
                </h2>

                {/* CORRECTED */}

                <div
                  style={{
                    background: "#eff6ff",
                    borderRadius: "14px",
                    padding: "14px",
                    marginBottom: "14px",
                    textAlign: "center",
                  }}
                >

                  <p
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "5px",
                    }}
                  >
                    Corrected Medicine
                  </p>

                  <h3
                    style={{
                      fontSize: "22px",
                      color: "#1d4ed8",
                      fontWeight: "700",
                    }}
                  >
                    {correctedMedicine}
                  </h3>

                </div>

                {/* INFO */}

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "14px",
                    padding: "14px",
                    textAlign: "center",
                  }}
                >

                  <p
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginBottom: "8px",
                    }}
                  >
                    Medicine Information
                  </p>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#334155",
                      lineHeight: "1.7",
                    }}
                  >
                    {medicineInfo}
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* RIGHT SECTION */}

        <div
          style={{
            background:
              "linear-gradient(145deg, #020617, #0f172a)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
          }}
        >

          {/* CARD */}

          <div
            style={{
              width: "100%",
              maxWidth: "390px",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "24px",
              boxShadow:
                "0 15px 40px rgba(0,0,0,0.25)",
            }}
          >

            {/* TITLE */}

            <h2
              style={{
                fontSize: "30px",
                lineHeight: "1.1",
                fontWeight: "800",
                color: "#020617",
                textAlign: "center",
                marginBottom: "14px",
              }}
            >
              Upload
              <br />
              Prescription
            </h2>

            {/* TEXT */}

            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                lineHeight: "1.7",
                textAlign: "center",
                marginBottom: "22px",
              }}
            >
              Upload handwritten prescriptions for
              intelligent digital analysis.
            </p>

            {/* UPLOAD BOX */}

            <div
              style={{
                border: "2px dashed #cbd5e1",
                borderRadius: "18px",
                padding: "24px 16px",
                background: "#f8fafc",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >

              <input
                type="file"
                onChange={handleFileChange}
              />

              <p
                style={{
                  marginTop: "14px",
                  fontSize: "13px",
                  color: "#64748b",
                  lineHeight: "1.6",
                }}
              >
                Drag & drop prescription here
                <br />
                or browse local storage
              </p>

            </div>

            {/* BUTTON */}

            <button
              disabled={loading}
              onClick={analyzePrescription}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, #2563eb, #60a5fa)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "700",
                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow:
                  "0 10px 25px rgba(37,99,235,0.3)",
              }}
            >
              {loading
                ? "Analyzing..."
                : "Analyze Prescription"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;