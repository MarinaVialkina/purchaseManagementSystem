import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers:{
        'Content-Type': 'application/json'
    }
})

export const getCustomers = async (params = {}) =>{
    const response = await api.get('/customers', {params });
    return response.data ;
};

export const getCustomerSimpleList = async () => {
    const response = await api.get('/customers/all');
    return response.data;
};

export const createCustomer = async (customerData) =>{
    const response = await api.post('/customers', customerData);
    return response.data ;
};

export const updateCustomer = async (code, customerData) =>{
    const response = await api.put(`/customers/${code}`, customerData);
    return response.data ;
};

export const deleteCustomer = async (code) =>{
    await api.delete(`/customers/${code}`);
};



export const getLots = async (params = {}) =>{
    const response = await api.get('/lots', {params });
    return response.data ;
};

export const createLot = async (lotData) =>{
    const response = await api.post('/lots', lotData);
    return response.data ;
};

export const updateLot = async (code, lotData) =>{
    const response = await api.put(`/lots/${code}`, lotData);
    return response.data ;
};

export const deleteLot = async (code) =>{
    await api.delete(`/lots/${code}`);
};