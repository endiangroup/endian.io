class Counter {
    constructor() {
        this._caa = 0;
    }
    lock() {
        this._caa = -this.abs();
    }
    isLocked() {
        return this._caa < 0;
    }
    unlock() {
        this._caa = this.abs();
    }
    isValid(s, delta) {
        let sessionCaa = abs(s);
        delta = abs(delta);
        return !this.isLocked() &&
            this.hasIssued() &&
            (sessionCaa + delta) >= this.abs();
    }
    issue() {
        let sessionCaa = this.abs();
        this.step(1);
        return sessionCaa;
    }
    revoke(n) {
        if (!this.hasIssued()) {
            return;
        }
        this.step(n);
    }
    hasIssued() {
        return this._caa !== 0;
    }
    step(n) {
        if (this.isLocked()) {
            this.decrement(n);
        }
        else {
            this.increment(n);
        }
    }
    increment(n) {
        this._caa += n;
    }
    decrement(n) {
        this._caa -= n;
    }
    abs() {
        return abs(this._caa);
    }
}
function abs(n) {
    if (n < 0) {
        return -n;
    }
    return n;
}
class ObservableCounter extends Counter {
    constructor() {
        super();
        this.master = ko.observable(0);
    }
    lock() {
        this.master(-abs(this.master()));
        super.lock();
    }
    unlock() {
        this.master(abs(this.master()));
        super.unlock();
    }
    increment(n) {
        this.master(this.master() + n);
        super.increment(n);
    }
    decrement(n) {
        this.master(this.master() - n);
        super.decrement(n);
    }
}
class Session {
    constructor(sessionCaa) {
        this.caa = sessionCaa;
    }
}
class CaaViewModel {
    constructor(caa) {
        this.caa = caa;
        this.delta = ko.observable(3);
        this.validSessions = ko.observableArray([]);
        this.invalidSessions = ko.observableArray([]);
        this.revokeN = ko.observable(3);
        this.delta.subscribe(this._redrawWithDelta, this);
        this.isLocked = ko.computed({
            read: () => {
                return this.caa.master() < 0;
            },
            write: () => {
                this.toggleLock();
            },
            owner: this
        });
        this.hasIssued = ko.computed(() => {
            return this.caa.master() !== 0;
        });
    }
    issue() {
        this.validSessions.push(new Session(this.caa.issue()));
        this._redrawWithDelta(this.delta());
    }
    revoke() {
        this.caa.revoke(Number(this.revokeN()));
        this._redrawWithDelta(this.delta());
    }
    lock() {
        this.caa.lock();
        this._redrawWithDelta(this.delta());
    }
    unlock() {
        this.caa.unlock();
        this._redrawWithDelta(this.delta());
    }
    toggleLock() {
        if (this.caa.isLocked()) {
            this.unlock();
        }
        else {
            this.lock();
        }
    }
    _redrawWithDelta(delta) {
        delta = Number(delta);
        let invalidOffset = null;
        this.validSessions().forEach((v, i) => {
            if (!this.caa.isValid(v.caa, delta)) {
                invalidOffset = i;
            }
        });
        if (invalidOffset !== null) {
            this.invalidSessions.push(...this.validSessions.splice(0, invalidOffset + 1));
        }
        let validOffset = null;
        this.invalidSessions().some((v, i) => {
            if (this.caa.isValid(v.caa, delta)) {
                validOffset = i;
                return true;
            }
        });
        if (validOffset !== null) {
            this.validSessions.unshift(...this.invalidSessions.splice(validOffset, this.invalidSessions().length));
        }
    }
}
function loadJQuery() {
    var waitForLoad = function () {
        if (typeof jQuery != "undefined") {
            $(document).ready(function () {
                ko.applyBindings(new CaaViewModel(new ObservableCounter));
                return false;
            });
        }
        else {
            window.setTimeout(waitForLoad, 200);
        }
    };
    window.setTimeout(waitForLoad, 200);
}
window.onload = loadJQuery;
