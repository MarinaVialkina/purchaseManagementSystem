import React, {useState, useEffect} from "react";

import { getCustomers, createCustomer, deleteCustomer } from "./api";

function Customers(){
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newCustomer, setNewCustomer] = useState({
        customerCode: "",
        customerName: "",
        customerInn: "",
        isOrganisation: false,
        isPerson: false
    });

    const [filter, setFilter] = useState({
        customerName: "",
        isOrganisation: ""
    })

    useEffect(() => {
        loadCustomers();
    }, []);




    const loadCustomers = async() => {
        setLoading(true);
        try{
            const data = await getCustomers(filter);
            setCustomers(data.content || data);

        }catch(error){
            console.error('Ошибка загрузки:', error);
            alert('Ошибка загрузки данных');
        }finally{
            setLoading(false);
        }
    };

    const handleCreate = async() => {

        try{
            await createCustomer(newCustomer);
            alert('Контрагент создан');

            setNewCustomer({
                customerCode: "",
                customerName: "",
                customerInn: "",
                isOrganisation: false,
                isPerson: false
            })

            loadCustomers();
        }catch(error){
            alert('Ошибка создания '+error.message());
        }
    };

    const handleDelete = async(code) => {
        if (window.confirm('Удалить контрагента?')){
            try{
                await deleteCustomer(code);
                alert('Контрагент удалён');
                loadCustomers();
            }catch(error){
                alert('Ошибка удаления '+error.message());
            }
        }
    };

    return(
        <div>
            <h1>контрагенты</h1>
            <div style={{border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                    
                <h3>Добавить контрагента</h3>
                <input placeholder="Код контрагента"
                    value={newCustomer.customerCode}
                    onChange={e => setNewCustomer({
                        ...newCustomer, 
                        customerCode: e.target.value
                    })}
                    style={{marginRight: "10px", padding: "5px"}}
                />

                <input placeholder="Наименование"
                    value={newCustomer.customerName}
                    onChange={e => setNewCustomer({
                        ...newCustomer, 
                        customerName: e.target.value
                    })}
                    style={{marginRight: "10px", padding: "5px"}}
                />
                <button onClick={handleCreate}>Добавить</button>
            </div>
        
        <div style={{marginBottom: "10px"}}>
            <input placeholder="Фильтр по названию"
                value={filter.customerName}
                onChange={e => setFilter({
                    ...filter, 
                    customerName: e.target.value
                })}
                style={{marginRight: "10px", padding: "5px"}}
            />   
            <button onClick={loadCustomers}>Применить фильтр</button> 
        </div>

        {loading ? (
            <p>Загрузка...</p>
        ) : (
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Код</th>
                        <th>Наименование</th>
                        <th>ИНН</th>
                        <th>Тип</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{textAlign: "center", padding: "20px"}}>
                                Нет данных
                            </td>
                        </tr>
                    ) : (
                        customers.map(customer =>(
                            <tr key={customer.customerCode}>
                                <td style={{padding: "10px"}}>{customer.customerCode}</td>
                                <td style={{padding: "10px"}}>{customer.customerName}</td>
                                <td style={{padding: "10px"}}>{customer.customerInn || '-'}</td>
                                <td style={{padding: "10px"}}>{customer.isOrganization ? 'Юр. лицо' : customer.isPerson ? 'Физ. лицо' : '-'}</td>
                                <td style={{padding: "10px"}}><button onClick={() => handleDelete(customer.customerCode)}>
                                    Удалить
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

        )}
    </div>
    );
}
export default Customers;