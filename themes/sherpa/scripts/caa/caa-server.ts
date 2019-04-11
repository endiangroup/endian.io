type SessionCAA = number;

interface CAA {
  lock(): void;
	unlock(): void;
  isLocked(): boolean;
	
	isValid(SessionCAA, number): boolean;
	
	revoke(number): void;
	issue(): SessionCAA;
	hasIssued(): boolean;
}

class Counter {
	private _caa: number
	constructor() {
		this._caa = 0
	}
	
	lock(): void {
		this._caa = -this.abs()
	}
	isLocked(): boolean {
		return this._caa < 0
	}
	unlock(): void {
		this._caa = this.abs()
	}
	
	isValid(s: SessionCAA, delta: number): boolean {
		let sessionCaa = abs(s)
		delta = abs(delta)
		
		return !this.isLocked() &&
						this.hasIssued() &&
						(sessionCaa+delta) >= this.abs()
	}
	
	issue(): SessionCAA {
		let sessionCaa = this.abs()
		this.step(1)
		
		return sessionCaa
	}
	revoke(n: number): void {
		if (!this.hasIssued()) {
			return
		}
		this.step(n)
	}
	
	hasIssued(): boolean {
	 return this._caa !== 0
	}
	
	private step(n: number) {
		if (this.isLocked()) {
			this.decrement(n)
		} else {
			this.increment(n)
		}
	}
	protected increment(n: number){
		this._caa += n
	}
	protected decrement(n: number){
		this._caa -= n
	}
	private abs(): number {
		return abs(this._caa)
	}
}

function abs(n: number) {
	if (n < 0) {
		return -n
	}
	return n
}

class ObservableCounter extends Counter {
	public master: KnockoutObservable<number>
	constructor() {
		super()
		this.master = ko.observable(0)
	}

	lock() {
		this.master(-abs(this.master()))
		super.lock()
	}
	unlock() {
		this.master(abs(this.master()))
		super.unlock()
	}

	protected increment(n: number) {
		this.master(this.master()+n)
		super.increment(n)
	}
	protected decrement(n: number) {
		this.master(this.master()-n)
		super.decrement(n)
	}
}

class Session {
	public caa: number
	constructor(sessionCaa: number) {
		this.caa = sessionCaa
	}
}


class CaaViewModel {
	public caa: ObservableCounter
	public delta: KnockoutObservable<number>
	public validSessions: KnockoutObservableArray<Session>
	public invalidSessions: KnockoutObservableArray<Session>
	public isLocked: KnockoutComputed<boolean>
	public revokeN: KnockoutObservable<number>
	public hasIssued: KnockoutComputed<boolean>

	constructor(caa: ObservableCounter) {
		this.caa = caa
		this.delta = ko.observable(3)
		this.validSessions = ko.observableArray([])
		this.invalidSessions = ko.observableArray([])
		this.revokeN = ko.observable(3)

		this.delta.subscribe(this._redrawWithDelta, this)
		this.isLocked = ko.computed({
			read: () => {
				return this.caa.master() < 0
			},
			write: () => {
				this.toggleLock()
			},
			owner: this
		})
		this.hasIssued = ko.computed(() => {
			return this.caa.master() !== 0
		})
	}

	issue() {
		this.validSessions.push(new Session(this.caa.issue()))
		this._redrawWithDelta(this.delta())
	}
	revoke() {
		this.caa.revoke(Number(this.revokeN()))
		this._redrawWithDelta(this.delta())
	}
	lock() {
		this.caa.lock()
		this._redrawWithDelta(this.delta())
	}
	unlock() {
		this.caa.unlock()
		this._redrawWithDelta(this.delta())
	}
	toggleLock() {
		if (this.caa.isLocked()) {
			this.unlock()
		} else {
			this.lock()
		}
	}

	private _redrawWithDelta(delta: number) {
		delta = Number(delta)
		let invalidOffset: number = null
		this.validSessions().forEach((v, i) => {
			if (!this.caa.isValid(v.caa, delta)) {
				invalidOffset = i
			}
		})
		if (invalidOffset !== null) {
			this.invalidSessions.push(...this.validSessions.splice(0, invalidOffset+1))
		}

		let validOffset: number = null
		this.invalidSessions().some((v, i): boolean => {
			if (this.caa.isValid(v.caa, delta)) {
				validOffset = i
				return true
			}
		})
		if (validOffset !== null) {
			this.validSessions.unshift(...this.invalidSessions.splice(validOffset, this.invalidSessions().length))
		}
	}
}


function loadJQuery(){
	var waitForLoad = function () {
		if (typeof jQuery != "undefined") {
			$(document).ready(function() {
				ko.applyBindings(new CaaViewModel(new ObservableCounter));
				return false;
			});
		} else {
			window.setTimeout(waitForLoad, 200);
		}
	};
	window.setTimeout(waitForLoad, 200);
}

window.onload = loadJQuery;
