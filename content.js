const approveButton = document.createElement("button");
approveButton.innerText = "Approve";
approveButton.classList.add("btn-primary", "btn");
approveButton.style.float = "right";
approveButton.type = "submit";
approveButton.name = "pull_request_review[event]";
approveButton.value = "approve";
approveButton.onclick = () => {
  const filesChangedUrl = `${window.location.origin}${window.location.pathname}/files`;
  const newTab = window.open(
    filesChangedUrl,
    "_blank",
    "popup,width=100,height=100,scrollbars=no,resizable=no,menubar=no,status=no,titlebar=no"
  );
  const onDocumentComplete = () => {
    if (newTab.document.readyState === "complete") {
      newTab.document.removeEventListener(
        "readystatechange",
        onDocumentComplete
      );
      setTimeout(() => {
        newTab.close();
        window.focus();
      }, 500);
    }
  };

  const onNewTabBeforeUnload = () => {
    newTab.removeEventListener("beforeunload", onNewTabBeforeUnload);
    const checkNewTabReady = setInterval(() => {
      if (newTab.document.readyState === "complete") {
        clearInterval(checkNewTabReady);
        onDocumentComplete();
      }
    }, 100);
  };
  newTab.addEventListener("beforeunload", onNewTabBeforeUnload);
  newTab.onload = () => {
    const summaryButton = newTab.document.querySelector(
      "#review-changes-modal > summary"
    );
    summaryButton.click();
    const approveButton = newTab.document.querySelector(
      "#review-changes-modal > div > div > div > form > div.form-actions.p-2.m-0.color-bg-subtle.border-top > button:nth-child(3)"
    );
    approveButton.click();
  };
};

function addApproveButton() {
  const conversationSection = document.querySelector(".merge-message");
  if (!conversationSection) {
    return;
  }
  conversationSection.appendChild(approveButton);
}

const conversationSectionObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.querySelector(".merge-message")) {
      addApproveButton();
      conversationSectionObserver.disconnect();
    }
  });
});

conversationSectionObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
