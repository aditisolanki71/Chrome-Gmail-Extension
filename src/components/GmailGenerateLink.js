import React from "react";
import PortalReactDOM from 'react-dom'
import { forEachUniqueContentEditable } from '../callbacks/ContentEditableDiv';
//all warning file
import PHRASES from '../warnings/phrases.json';

import * as Util from '../helpers/util.js';
import { findRanges } from '../helpers/RangeFinder';
import "../gmail-generate-link.css"
import Warning from "./Warning"
const WATCH_FOR_NEW_NODES = {
    subtree: true,
    childList: true,
};
const WAIT_TIME_BEFORE_RECALC_WARNINGS = 500;

const MESSAGE_PATTERNS = PHRASES.map((phrase) => ({
    regex: new RegExp(phrase.pattern, 'gi'),
    message: phrase.message,
    link: phrase.link
  }));
console.log("message pattern",MESSAGE_PATTERNS);
class GmailGenerateLink extends React.Component {
    constructor(props) {
        console.log("constructor called");
        super(props);
        this.state = {
          parentNode: {},
          warnings: [],
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.applyEventListeners = this.applyEventListeners.bind(this);
        this.updateWarnings = this.updateWarnings.bind(this);
        this.documentObserver = new MutationObserver(
            forEachUniqueContentEditable(this.applyEventListeners)
          );
        console.log("document observer",this.documentObserver);
        this.documentObserver.observe(document.body, WATCH_FOR_NEW_NODES);
    }

    updateWarnings(email, patterns) {
        console.log("update warnings email",email);
        console.log("update warnings patterns",patterns);
        if (!email || !email.offsetParent) {
          this.resetState();
          return;
        }
        console.log("child node email",email.childNodes);
        const temp = Array.from(email.childNodes).filter((node) => node.textContent !== '').flatMap((text) => findRanges(text, patterns));
        console.log("temp",temp);
        const newWarnings =
          email.childNodes.length > 0
            ? Array.from(email.childNodes)
                .filter((node) => node.textContent !== '')
                .flatMap((text) => findRanges(text, patterns))
            : findRanges(email, patterns);
    
        console.log("new warnings",newWarnings);
        this.setState({ parentNode : email.offsetParent, warnings: newWarnings });
        console.log("parent node is",this.state.parentNode);
      }
    
    handleSearch(email, patterns) {
        console.log("handle search patterns",patterns);
        console.log("handle search email",email);
        return Util.debounce(
          () => this.updateWarnings(email, patterns),
          WAIT_TIME_BEFORE_RECALC_WARNINGS
        );
    }

      
    applyEventListeners(mutation) {
        console.log("apply event listener called",mutation);
        const email = mutation.target;
        console.log("email is",email);
        const searchHandler = this.handleSearch(email, MESSAGE_PATTERNS);
        email.addEventListener('input', searchHandler);
        email.addEventListener('focus', searchHandler);
        email.addEventListener('cut', searchHandler);
        email.addEventListener('blur', this.resetState);
    }

    render() {
        console.log("***just not sorry called***",this.state.warnings);
        if (this.state.warnings.length > 0) {
            const parentNode = this.state.parentNode;
            console.log("parent node",parentNode);
            const parentRect = parentNode.getBoundingClientRect();
            console.log("parentrect",parentRect);
            const warnings = this.state.warnings.map((warning, index) => (
              // <a href={warning.link}>
                <Warning key={index} parentRect={parentRect} value={warning} />
              // </a>
            ));
            console.log("Warnings",warnings);
            console.log("parent node",parentNode);
            //return ReactDOM.createPortal(warnings, parentNode);          
            
            // const uiRoot = document.createElement('parentNode');
            // return PortalReactDOM.createPortal(warnings,document.body.appendChild(uiRoot));
            return PortalReactDOM.createPortal(warnings, parentNode);
        }
     }
}
export default GmailGenerateLink;