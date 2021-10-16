export const DEFAULT_VALUE_JOB_NEW = {
	jobNumber: '',
	jobType: '',
	lots: '',
	block: '',
	roadAllowance: '',
	registeredPlanNo: '',
	registryOffice: '',
	cityTown: '',
	rpNo: '',
	range: '',
	municipality: '',
	streetNumber: '',
	streetName: '',
	streetType: '',
	concession: '',
	client: '',
	clientPhone: '',
	clientEmail: '',
	company: '',
	originalFileName: '',
	project: '',
	startedDate: '',
	endDate: '',
}

export const jobNumberValidation = (value) => /^[0-9]{4}-[0-9]{3}$/.test(value)
export const phoneValidation = (value) => /^(?:\(\d{3}\)|\d{3}-)\d{3}-\d{4}$/.test(value)
export const emailValidation = (value) => /\S+@\S+\.\S+/.test(value)
