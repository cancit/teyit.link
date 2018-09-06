import { h, render } from 'preact';
import ArchiveInput from './ArchiveInput';
import Api from './api';

window.Api = Api;

const ArchiveInputNode = document.getElementById('tl-archive-input');
if (ArchiveInputNode) {
    render(<ArchiveInput />, ArchiveInputNode, ArchiveInputNode.lastChild);
}

const inProgressSlug = window["ARCHIVE_IN_PROGRESS"];
if (inProgressSlug) {
    Api.RefreshWhenArchived(inProgressSlug);
}


// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-85970084-2', 'auto');
ga('send', 'pageview');
