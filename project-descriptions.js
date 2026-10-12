const descriptionsScriptUrl = document.currentScript.src;

const initializeProjectDescriptions = () => {
const profileName = document.querySelector(".site .name");

if (profileName) {
  const profileNavigationKey = "profile-navigation-to-home";
  const isProjectPage = document.body.classList.contains("project-page");

  if (isProjectPage) {
    profileName.addEventListener("click", () => {
      if (!isProfileTap()) {
        sessionStorage.setItem(profileNavigationKey, "true");
      }
    });
  }

  const profileRegion = document.createElement("aside");
  profileRegion.className = "profile-hover-region";
  profileRegion.setAttribute("aria-label", "About Matteo Figini");
  profileRegion.id = "profile-hover-content";
  profileName.setAttribute("aria-controls", profileRegion.id);
  profileName.setAttribute("aria-expanded", "false");

  const profileContent = document.createElement("div");
  profileContent.className = "profile-hover-content";

  const bio = document.createElement("div");
  bio.className = "project-description-copy profile-hover-bio";
  [
    "The digital communication aims to guide visitors through the thermal centers via an app, offering personalized interactive tours based on cultural interests like history and art.",
    "The app also enables ticket purchases for visits, thermal treatments, personalized events, and local rediscovery."
  ].forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    bio.append(paragraph);
  });

  const services = document.createElement("div");
  services.className = "profile-hover-services";
  const metadata = document.createElement("dl");
  metadata.className = "project-metadata";
  const servicesLabel = document.createElement("dt");
  servicesLabel.className = "project-metadata-label";
  servicesLabel.textContent = "Services";
  const servicesValue = document.createElement("dd");
  servicesValue.className = "project-metadata-value";
  const servicesList = document.createElement("ul");
  servicesList.className = "profile-hover-service-list";
  [
    "Art Direction",
    "Visual Design",
    "UX/UI Design",
    "Brand Design",
    "Editorial Design",
    "Creative AI",
    "Social Media",
    "Motion Design"
  ].forEach((text) => {
    const service = document.createElement("li");
    service.textContent = text;
    servicesList.append(service);
  });
  servicesValue.append(servicesList);
  metadata.append(servicesLabel, servicesValue);
  services.append(metadata);
  profileContent.append(bio, services);
  profileRegion.append(profileContent);
  document.body.append(profileRegion);

  const isProfileTap = () =>
    window.matchMedia("(max-width: 480px), (pointer: coarse)").matches;
  const updateProfileWidth = () => {
    if (window.matchMedia("(max-width: 480px)").matches) {
      profileRegion.style.width =
        "calc(100vw - var(--margin-x) - var(--margin-x))";
    } else {
      profileRegion.style.removeProperty("width");
    }
  };
  const setProfileActive = (isActive) => {
    document.body.classList.toggle("is-profile-active", isActive);
    profileName.setAttribute("aria-expanded", String(isActive));
  };

  const clearNavigationGuard = () => {
    document.body.classList.remove("is-navigating");
  };
  const consumeProfileNavigation = () => {
    if (
      isProjectPage ||
      sessionStorage.getItem(profileNavigationKey) !== "true"
    ) {
      return;
    }

    sessionStorage.removeItem(profileNavigationKey);
    if (isProfileTap()) {
      return;
    }

    document.body.classList.add("is-navigating");
    setProfileActive(false);
  };

  profileName.addEventListener("mouseleave", clearNavigationGuard);
  consumeProfileNavigation();
  window.addEventListener("pageshow", consumeProfileNavigation);

  updateProfileWidth();
  window.addEventListener("resize", updateProfileWidth);

  profileName.addEventListener("click", (event) => {
    if (!isProfileTap()) {
      return;
    }

    event.preventDefault();
    setProfileActive(!document.body.classList.contains("is-profile-active"));
  });

  profileContent.addEventListener("click", () => {
    if (isProfileTap()) {
      setProfileActive(false);
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (
      isProfileTap() &&
      document.body.classList.contains("is-profile-active") &&
      !profileName.contains(event.target) &&
      !profileContent.contains(event.target)
    ) {
      setProfileActive(false);
    }
  });

  document.addEventListener("pointermove", (event) => {
    if (
      isProfileTap() ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    if (document.body.classList.contains("is-navigating")) {
      setProfileActive(false);
      return;
    }

    const nameBounds = profileName.getBoundingClientRect();
    const contentBounds = profileContent.getBoundingClientRect();
    const servicesBounds = metadata.getBoundingClientRect();
    const isOverName =
      event.clientX >= nameBounds.left &&
      event.clientX <= nameBounds.right &&
      event.clientY >= nameBounds.top &&
      event.clientY <= nameBounds.bottom;
    const isWithinProfileArea =
      event.clientX >= contentBounds.left &&
      event.clientX <= servicesBounds.right &&
      event.clientY >= nameBounds.top &&
      event.clientY <= servicesBounds.bottom;
    const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
    const isOverProjectNavigation =
      hoveredElement && hoveredElement.closest(".site .work, .project-link");
    const isActive = document.body.classList.contains("is-profile-active");

    if (isOverName && !isOverProjectNavigation) {
      setProfileActive(true);
    } else if (isActive && (!isWithinProfileArea || isOverProjectNavigation)) {
      setProfileActive(false);
    }
  });
}

const descriptionsAreAvailable = !window.matchMedia("(max-width: 480px)").matches;

if (descriptionsAreAvailable) {
  const firstColumn = document.querySelector(".site > .column:first-child");
  const projectLinks = Array.from(document.querySelectorAll(".project-link"));
  const projectNav = document.querySelector(".work-projects");

  if (firstColumn && projectLinks.length > 0 && projectNav) {
    const descriptions = new Map();
    const descriptionContainer = document.createElement("aside");
    descriptionContainer.className = "project-descriptions";
    descriptionContainer.setAttribute("aria-label", "Project descriptions");

    function updateActiveDescription() {
      const activeLink =
        projectLinks.find((link) => link.matches(":hover")) ||
        projectLinks.find((link) => link.matches(":focus-visible"));
      const activeHref = activeLink && activeLink.getAttribute("href");

      descriptions.forEach((description, href) => {
        const isActive = href === activeHref;
        description.classList.toggle("is-active", isActive);
        description.setAttribute("aria-hidden", String(!isActive));
      });
    }

    projectNav.addEventListener("pointerover", updateActiveDescription);
    projectNav.addEventListener("pointerout", updateActiveDescription);
    projectNav.addEventListener("focusin", updateActiveDescription);
    projectNav.addEventListener("focusout", updateActiveDescription);

    document.body.append(descriptionContainer);

    const contentScript = document.createElement("script");
    contentScript.src = new URL(
      "./project-description-content.js",
      descriptionsScriptUrl
    ).href;
    contentScript.onload = () => {
      if (!Array.isArray(window.projectDescriptions)) {
        console.error("Project descriptions could not be loaded.");
        return;
      }

      window.projectDescriptions.forEach(({ href, text, metadata }) => {
        if (!projectLinks.some((link) => link.getAttribute("href") === href)) {
          return;
        }

        const description = document.createElement("div");
        description.className = "project-description";
        description.setAttribute("aria-hidden", "true");

        const copy = document.createElement("div");
        copy.className = "project-description-copy";
        text.split("\n\n").forEach((paragraphText) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = paragraphText;
          copy.append(paragraph);
        });
        description.append(copy);

        if (Array.isArray(metadata)) {
          const metadataList = document.createElement("dl");
          metadataList.className = "project-metadata";

          metadata.forEach(({ label, value }) => {
            const term = document.createElement("dt");
            term.className = "project-metadata-label";
            term.textContent = label;

            const detail = document.createElement("dd");
            detail.className = "project-metadata-value";
            detail.textContent = value;

            metadataList.append(term, detail);
          });

          description.append(metadataList);
        }

        descriptionContainer.append(description);
        descriptions.set(href, description);
      });

      updateActiveDescription();
    };
    contentScript.onerror = () => {
      console.error("Project descriptions could not be loaded.");
    };
    document.head.append(contentScript);
  }
}
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeProjectDescriptions, {
    once: true
  });
} else {
  initializeProjectDescriptions();
}
