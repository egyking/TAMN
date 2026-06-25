import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DEFAULT_USER } from "../utils/storage";
import BigButton from "../components/shared/BigButton";

export default function Onboarding() {
  const { updateUser } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [contacts, setContacts] = useState(DEFAULT_USER.contacts);
  const [medications, setMedications] = useState(DEFAULT_USER.medications);

  const handleNextStep1 = () => {
    if (!name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 500);
      return;
    }
    setStep(2);
  };

  const updateContact = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const updateMedication = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setMedications(newMeds);
  };

  const completeOnboarding = () => {
    updateUser({
      name,
      contacts,
      medications,
      setupDone: true,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        padding: "24px",
        maxWidth: "480px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "40px",
          marginTop: "20px",
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: step >= i ? "var(--green)" : "var(--border)",
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, animation: "fadeIn 0.3s ease" }}>
        {step === 1 && (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>💚</div>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "var(--green)",
                  marginBottom: "8px",
                }}
              >
                أهلاً بيك في رفيق
              </h1>
              <p
                style={{
                  fontSize: "20px",
                  color: "var(--text-muted)",
                  marginBottom: "40px",
                }}
              >
                رعاية تُطمئن قلبك • ونَس يملأ يومك
              </p>

              <input
                type="text"
                placeholder="أسم حضرتك"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(false);
                }}
                style={{
                  height: "56px",
                  fontSize: "20px",
                  borderRadius: "var(--radius-sm)",
                  border: `2px solid ${nameError ? "var(--red)" : "var(--border)"}`,
                  transform: nameError ? "translateX(5px)" : "none",
                  transition: "all 0.1s",
                }}
              />
            </div>
            <BigButton
              label="التالي"
              icon="fa-solid fa-arrow-left"
              onClick={handleNextStep1}
              style={{ marginTop: "auto" }}
            />
          </div>
        )}

        {step === 2 && (
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 700,
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              أضف أرقام أسرتك
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                flex: 1,
                overflowY: "auto",
                paddingBottom: "20px",
              }}
            >
              {contacts.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>{c.avatar}</span>
                    <span
                      style={{ fontSize: "18px", color: "var(--text-muted)" }}
                    >
                      {c.relation}
                    </span>
                  </div>
                  <input
                    placeholder="الاسم"
                    value={c.name}
                    onChange={(e) => updateContact(i, "name", e.target.value)}
                  />
                  <input
                    placeholder="رقم الجوال"
                    type="tel"
                    dir="ltr"
                    value={c.phone}
                    onChange={(e) => updateContact(i, "phone", e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <BigButton label="التالي" onClick={() => setStep(3)} />
              <button
                onClick={() => setStep(3)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                تجاوز
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 700,
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              أي أدوية بتاخدها؟
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                flex: 1,
                overflowY: "auto",
                paddingBottom: "20px",
              }}
            >
              {medications.map((m, i) => {
                const timeLabels = {
                  morning: "الصباح ☀️",
                  noon: "الظهر 🌤️",
                  evening: "المساء 🌅",
                  night: "النوم 🌙",
                };
                return (
                  <div
                    key={m.id}
                    style={{
                      backgroundColor: "white",
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "20px", fontWeight: 700 }}>
                        {timeLabels[m.time]}
                      </span>
                      <button
                        className={`toggle-switch ${m.enabled ? "active" : ""}`}
                        onClick={() =>
                          updateMedication(i, "enabled", !m.enabled)
                        }
                      />
                    </div>
                    {m.enabled && (
                      <input
                        placeholder="اسم الدواء"
                        value={m.name}
                        onChange={(e) =>
                          updateMedication(i, "name", e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <BigButton label="ابدأ رفيق ✓" onClick={completeOnboarding} />
              <button
                onClick={completeOnboarding}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                تجاوز
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
