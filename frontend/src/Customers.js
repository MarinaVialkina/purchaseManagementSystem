import React, {useState, useEffect} from "react";

import { getCustomers, createCustomer, deleteCustomer, updateCustomer } from "./api";

function Customers(){
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCustomerCode, setEditingCustomerCode] = useState("");

    const [newCustomer, setNewCustomer] = useState({
        customerCode: "",
        customerName: "",
        customerInn: "",
        customerKpp: "",
        customerLegalAddress: "",
        customerPostalAddress: "",
        customerEmail: "",
        customerCodeMain: "",
        isOrganization: false,
        isPerson: false
    });

    const [filter, setFilter] = useState({
        customerCode: "",
        customerName: "",
        customerInn: "",
        customerKpp: "",
        customerLegalAddress: "",
        customerPostalAddress: "",
        customerEmail: "",
        customerCodeMain: "",
        isOrganization: "",
        isPerson: ""
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
                customerKpp: "",
                customerLegalAddress: "",
                customerPostalAddress: "",
                customerEmail: "",
                customerCodeMain: "",
                isOrganization: false,
                isPerson: false
            })

            loadCustomers();
        }catch(error){
            alert('Ошибка создания '+error.message);
        }
    };

    const handleDelete = async(code) => {
        if (window.confirm('Удалить контрагента?')){
            try{
                await deleteCustomer(code);
                alert('Контрагент удалён');
                loadCustomers();
            }catch(error){
                alert('Ошибка удаления '+error.message);
            }
        }
    };

    return(
        <div>
            <h1>Контрагенты</h1>
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

                <input placeholder="ИНН"
                    value={newCustomer.customerInn}
                    onChange={e => setNewCustomer({
                        ...newCustomer, 
                        customerInn: e.target.value
                    })}
                    style={{marginRight: "10px", padding: "5px"}}
                />

                <input placeholder="КПП"
                    value={newCustomer.customerKpp}
                    onChange={e => setNewCustomer({
                        ...newCustomer, 
                        customerKpp: e.target.value
                    })}
                    style={{marginRight: "10px", padding: "5px"}}
                />

                <input placeholder="Юр. адрес"
                    value={newCustomer.customerLegalAddress}
                    onChange={e => setNewCustomer({
                        ...newCustomer, 
                        customerLegalAddress: e.target.value
                    })}
                    style={{marginRight: "10px", padding: "5px"}}
                />

                <input placeholder="Почтовый адрес"
                    value={newCustomer.customerPostalAddress}
                    onChange={e => setNewCustomer({
                        ...newCustomer, 
                        customerPostalAddress: e.target.value
                    })}
                    style={{marginRight: "10px", padding: "5px"}}
                />

                <input placeholder="Электронная почта"
                    value={newCustomer.customerEmail}
                    onChange={e => setNewCustomer({
                        ...newCustomer, 
                        customerEmail: e.target.value
                    })}
                    style={{marginRight: "10px", padding: "5px"}}
                />

                <input placeholder="Вышестоящий контрагент"
                    value={newCustomer.customerCodeMain}
                    onChange={e => setNewCustomer({
                        ...newCustomer, 
                        customerCodeMain: e.target.value
                    })}
                    style={{marginRight: "10px", padding: "5px"}}
                />

                <label style={{marginRight: "10px"}}>
                    <input 
                        type="checkbox"
                        checked={newCustomer.isOrganization}
                        onChange={e => setNewCustomer({
                            ...newCustomer, 
                            isOrganization: e.target.checked,
                            isPerson: e.target.checked ? false : newCustomer.isPerson
                        })}
                        style={{marginRight: "5px"}}
                    />
                    Юр. лицо
                </label>
  
                <label style={{marginRight: "10px"}}>
                    <input 
                        type="checkbox"
                        checked={newCustomer.isPerson}
                        onChange={e => setNewCustomer({
                            ...newCustomer, 
                                isPerson: e.target.checked,
                                isOrganization: e.target.checked ? false : newCustomer.isOrganization
                        })}
                        style={{marginRight: "5px"}}
                    />
                     Физ. лицо
                </label>
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

            <input placeholder="Фильтр по ИНН"
                value={filter.customerInn}
                onChange={e => setFilter({
                    ...filter, 
                    customerInn: e.target.value
                })}
                style={{marginRight: "10px", padding: "5px"}}
            />

            <input placeholder="Фильтр по КПП"
                value={filter.customerKpp}
                onChange={e => setFilter({
                    ...filter, 
                    customerKpp: e.target.value
                })}
                style={{marginRight: "10px", padding: "5px"}}
            />

            <input placeholder="Фильтр по юр. адресу"
                value={filter.customerLegalAddress}
                onChange={e => setFilter({
                    ...filter, 
                    customerLegalAddress: e.target.value
                })}
                style={{marginRight: "10px", padding: "5px"}}
            />

            <input placeholder="Фильтр по почтовому адресу"
                value={filter.customerPostalAddress}
                onChange={e => setFilter({
                    ...filter, 
                    customerPostalAddress: e.target.value
                })}
                style={{marginRight: "10px", padding: "5px"}}
            />

            <input placeholder="Фильтр по электронной почте"
                value={filter.customerEmail}
                onChange={e => setFilter({
                    ...filter, 
                    customerEmail: e.target.value
                })}
                style={{marginRight: "10px", padding: "5px"}}
            />

            <input placeholder="Фильтр по вышестоящему контрагенту"
                value={filter.customerCodeMain}
                onChange={e => setFilter({
                    ...filter, 
                    customerCodeMain: e.target.value
                })}
                style={{marginRight: "10px", padding: "5px"}}
            />

            <label style={{marginRight: "10px"}}>
                <input 
                    type="checkbox"
                    checked={filter.isOrganization}
                    onChange={e => setFilter({
                        ...filter, 
                        isOrganization: e.target.checked,
                        isPerson: e.target.checked ? false : filter.isPerson
                    })}
                    style={{marginRight: "5px"}}
                />
                Юр. лицо
            </label>
  
            <label style={{marginRight: "10px"}}>
                <input 
                    type="checkbox"
                    checked={filter.isPerson}
                    onChange={e => setFilter({
                        ...filter, 
                            isPerson: e.target.checked,
                            isOrganization: e.target.checked ? false : filter.isOrganization
                    })}
                    style={{marginRight: "5px"}}
                />
                Физ. лицо
            </label>
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
                        <th>КПП</th>
                        <th>Юр. адрес</th>
                        <th>Почтовый адрес</th>
                        <th>Электронная почта</th>
                        <th>Вышестоящий контрагент</th>
                        <th>Юр. лицо/Физ. лицо</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{textAlign: "center", padding: "20px"}}>
                                Нет данных
                            </td>
                        </tr>
                    ) : (
                        customers.map(customer =>(
                            <tr key={customer.customerCode}>
                                <td style={{padding: "10px"}}>{customer.customerCode}</td>
                                <td style={{padding: "10px"}}>{customer.customerName}</td>
                                <td style={{padding: "10px"}}>{customer.customerInn || '-'}</td>
                                <td style={{padding: "10px"}}>{customer.customerKpp || '-'}</td>
                                <td style={{padding: "10px"}}>{customer.customerLegalAddress}</td>
                                <td style={{padding: "10px"}}>{customer.customerPostalAddress}</td>
                                <td style={{padding: "10px"}}>{customer.customerEmail}</td>
                                <td style={{padding: "10px"}}>{customer.customerCodeMain || '-'}</td>
                                <td style={{padding: "10px"}}>{customer.isOrganization ? 'Юр. лицо' : customer.isPerson ? 'Физ. лицо' : '-'}</td>
                                <td style={{padding: "10px"}}>
                                    <div><button onClick={() => handleDelete(customer.customerCode)}>Удалить</button></div>
                                    <div><button onClick={() => handleUpdate(customer.customerCode)}>Обновить</button></div>
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