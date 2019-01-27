import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";

import ArchiveInput from "./ArchiveInput";
import AlreadyArchivedModal from "./AlreadyArchivedModal";
import Api from "./api";
import SearchBar from "./SearchBar";

window.Api = Api;

if (Api.GetLocalData("RENDER_SEARCH_BAR", false)) {
  ReactDOM.render(<SearchBar />, document.getElementById("tl-search-bar"));
}
if (Api.GetLocalData("RENDER_ARCHIVE_INPUT", false)) {
  ReactDOM.render(
    <ArchiveInput />,
    document.getElementById("tl-archive-input")
  );
}

if (Api.GetLocalData("ARCHIVE_IN_PROGRESS", false)) {
  Api.RefreshWhenArchived(Api.GetLocalData("ARCHIVE").slug);
}

if (Api.GetLocalData("SHOW_ALREADY_ARCHIVED_MODAL", false)) {
  ReactDOM.render(
    <AlreadyArchivedModal {...Api.GetLocalData("ARCHIVE", {})} />,
    document.getElementById("tl-already-archived-modal")
  );
}

if (Api.GetLocalData("PAGE", "") === "archive_show") {
  const archive = Api.GetLocalData("ARCHIVE");
  if (archive.archived_at) {
    const archivedAt = moment(archive.archived_at).format("LL LTS");
    document.getElementById("archive-created-at").innerText = archivedAt;
  }
}

// Google Analytics
(function(i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  "script",
  "https://www.google-analytics.com/analytics.js",
  "ga"
);
ga("create", "UA-85970084-2", "auto");
ga("send", "pageview");
