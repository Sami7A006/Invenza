/**
 * Register page — Vercel Serverless Forms.
 * Requires selected problem in localStorage (set from index.html "Select & Register").
 * Form submits via JS fetch to /api/submit.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "invenza_selected_problem";
  const REGISTERED_TEAMS_KEY = "invenza_registered_teams_v1";
  const REGISTERED_LOCK_KEY = "registered";

  const SUBMIT_ENDPOINT = "/api/submit";

  function getSelectedProblem() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function redirectToDomains() {
    window.location.replace("index.html#domains");
  }

  function showSuccessView(teamID) {
    var headerEl = document.getElementById("registerHeader");
    var formWrap = document.getElementById("registerFormWrap");
    var successEl = document.getElementById("registerSuccess");

    if (headerEl) headerEl.classList.add("hidden");
    if (formWrap) formWrap.classList.add("hidden");
    if (successEl) {
      successEl.classList.remove("hidden");
      var successTextEl = document.querySelector(".register-success-text");
      if (successTextEl) {
        successTextEl.textContent =
          "Thank you for registering. We have received your details for the selected problem. Your Team ID: " +
          (teamID || "INV-XXX");
      }
    }
  }

  function showError(message) {
    var errEl = document.getElementById("registerError");
    if (!errEl) return;
    errEl.textContent = message;
    errEl.classList.remove("hidden");
  }

  function hideError() {
    var errEl = document.getElementById("registerError");
    if (!errEl) return;
    errEl.textContent = "";
    errEl.classList.add("hidden");
  }

  function normalizeTeamName(name) {
    return String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function loadRegisteredTeams() {
    try {
      var raw = localStorage.getItem(REGISTERED_TEAMS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function init() {
    var selected = getSelectedProblem();

    if (!selected || !selected.domain || !selected.title) {
      redirectToDomains();
      return;
    }

    var selectedText = selected.domain + " — " + selected.title;
    var displayEl = document.getElementById("registerProblemDisplay");
    var selectedInput = document.getElementById("selectedProblem");
    var domainInput = document.getElementById("domain");

    if (displayEl) displayEl.textContent = "Selected problem: " + selected.title;
    if (selectedInput) selectedInput.value = selectedText;
    if (domainInput) domainInput.value = selected.domain || "";

    var formEl = document.getElementById("registerForm");
    var teamNameEl = document.getElementById("teamName");
    var submitBtn = document.getElementById("registerSubmit");

    if (formEl && teamNameEl) {
      formEl.addEventListener("submit", async function (e) {
        e.preventDefault();
        hideError();

        try {
          if (localStorage.getItem(REGISTERED_LOCK_KEY)) {
            showError("You have already registered.");
            return;
          }
        } catch (err) { }

        var teamKey = normalizeTeamName(teamNameEl.value);
        if (!teamKey) return;

        var teams = loadRegisteredTeams();
        if (teams[teamKey]) {
          showError("This team name is already registered. One problem per team is allowed.");
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Registering...";
        }

        try {
          const formData = new FormData(formEl);
          const data = Object.fromEntries(formData.entries());

          var res = await fetch(SUBMIT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          var json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.error || "Could not register. Please try again.");
          }

          // Registration successful
          // Save local frontend lock
          try {
            teams[teamKey] = {
              team_name: data.team_name || "",
              selected_problem: data.selected_problem || "",
              submitted_at: new Date().toISOString()
            };
            localStorage.setItem(REGISTERED_TEAMS_KEY, JSON.stringify(teams));
            localStorage.setItem(REGISTERED_LOCK_KEY, "true");
            localStorage.removeItem(STORAGE_KEY);
          } catch (err) { }

          showSuccessView(json.teamID);

        } catch (err) {
          var msg = err && err.message ? err.message : "An error occurred during registration. Please try again.";
          showError(msg);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Register";
          }
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
