import React, { useState, useEffect } from "react";

import { getCustomers, createCustomer, deleteCustomer, updateCustomer, getCustomerSimpleList } from "./api";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [customersSimple, setCustomersSimple] = useState([]);
    const [loadingCustomersSimple, setLoadingCustomersSimple] = useState(false);

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

    const [editingCustomer, setEditingCustomer] = useState(null);

    const [filter, setFilter] = useState({
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

    const [sortConfig, setSortConfig] = useState({
        key: 'customerName',
        direction: 'asc'
    });

    useEffect(() => {
        loadCustomers();
        loadCustomersSimple();
    }, []);




    const loadCustomers = async () => {
        setLoading(true);
        try {
            const cleanFilter = {};

            if (filter.customerCode) cleanFilter.customerCode = filter.customerCode;
            if (filter.customerName) cleanFilter.customerName = filter.customerName;
            if (filter.customerInn) cleanFilter.customerInn = filter.customerInn;
            if (filter.customerKpp) cleanFilter.customerKpp = filter.customerKpp;
            if (filter.customerLegalAddress) cleanFilter.customerLegalAddress = filter.customerLegalAddress;
            if (filter.customerPostalAddress) cleanFilter.customerPostalAddress = filter.customerPostalAddress;
            if (filter.customerEmail) cleanFilter.customerEmail = filter.customerEmail;
            if (filter.customerCodeMain) cleanFilter.customerCodeMain = filter.customerCodeMain;

            if (filter.isOrganization !== undefined && filter.isOrganization !== false) {
                cleanFilter.organization = filter.isOrganization;
            }
            if (filter.isPerson !== undefined && filter.isPerson !== false) {
                cleanFilter.person = filter.isPerson;
            }

            const data = await getCustomers(cleanFilter);
            setCustomers(data.content || data);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const loadCustomersSimple = async () => {
        setLoadingCustomersSimple(true);
        try {
            const data = await getCustomerSimpleList();
            setCustomersSimple(data);
        } catch (error) {
            alert('Ошибка загрузки списка контрагентов');
        } finally {
            setLoadingCustomersSimple(false);
        }
    };

    const handleCreate = async () => {
        try {
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
        } catch (error) {
            alert(`Ошибка создания контрагента:\n${error.message}`);
        }
    };

    const handleDelete = async (code) => {
        if (window.confirm('Удалить контрагента?')) {
            try {
                await deleteCustomer(code);
                alert('Контрагент удалён');
                loadCustomers();
            } catch (error) {
                alert('Ошибка удаления контрагента ' + error.message);
            }
        }
    };

    const startEdit = (customer) => {
        setEditingCustomer({ ...customer })
    }

    const cancelEdit = () => {
        setEditingCustomer(null)
    }

    const handleUpdate = async () => {
        if (!editingCustomer) return;

        try {
            await updateCustomer(editingCustomer.customerCode, editingCustomer);
            alert('Контрагент обновлён.');
            setEditingCustomer("");
            loadCustomers();
        } catch (error) {
            alert(`Ошибка обновления:\n${error.message}`);
        }
    }

    const resetFilterHandler = async () => {
        const resetFilter = {
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
        };

        setFilter(resetFilter);

        const cleanFilter = {};

        try {
            setLoading(true);
            const data = await getCustomers(cleanFilter);
            setCustomers(data.content || data);
        } catch (error) {
            alert('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const sortCustomers = (key) => {
        let direction = 'asc';

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });

        const sortedCustomers = [...customers].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setCustomers(sortedCustomers);
    };

    return (
        <div>
            <h1>Контрагенты</h1>
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>

                <h3>Добавить контрагента</h3>
                <input
                    placeholder="Код контрагента"
                    value={newCustomer.customerCode}
                    onChange={e => setNewCustomer({
                        ...newCustomer,
                        customerCode: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Наименование"
                    value={newCustomer.customerName}
                    onChange={e => setNewCustomer({
                        ...newCustomer,
                        customerName: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="ИНН"
                    value={newCustomer.customerInn}
                    onChange={e => setNewCustomer({
                        ...newCustomer,
                        customerInn: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="КПП"
                    value={newCustomer.customerKpp}
                    onChange={e => setNewCustomer({
                        ...newCustomer,
                        customerKpp: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Юр. адрес"
                    value={newCustomer.customerLegalAddress}
                    onChange={e => setNewCustomer({
                        ...newCustomer,
                        customerLegalAddress: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Почтовый адрес"
                    value={newCustomer.customerPostalAddress}
                    onChange={e => setNewCustomer({
                        ...newCustomer,
                        customerPostalAddress: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Электронная почта"
                    value={newCustomer.customerEmail}
                    onChange={e => setNewCustomer({
                        ...newCustomer,
                        customerEmail: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <select
                    value={newCustomer.customerCodeMain || ""}
                    onChange={e => setNewCustomer({
                        ...newCustomer,
                        customerCodeMain: e.target.value
                    })}
                    style={{ padding: "5px", minWidth: "200px" }}
                    disabled={loadingCustomersSimple}
                >
                    <option value="">Вышестоящий контрагент</option>
                    {customersSimple.map(customer => (
                        <option key={customer.customerCode} value={customer.customerCode}>
                            {customer.customerName} ({customer.customerCode})
                        </option>
                    ))}
                </select>
                {loadingCustomersSimple && <span style={{ marginLeft: "10px" }}>Загрузка...</span>}

                <label style={{ marginRight: "10px" }}>
                    <input
                        type="checkbox"
                        checked={newCustomer.isOrganization}
                        onChange={e => setNewCustomer({
                            ...newCustomer,
                            isOrganization: e.target.checked,
                            isPerson: e.target.checked ? false : newCustomer.isPerson
                        })}
                        style={{ marginRight: "5px" }}
                    />
                    Юр. лицо
                </label>

                <label style={{ marginRight: "10px" }}>
                    <input
                        type="checkbox"
                        checked={newCustomer.isPerson}
                        onChange={e => setNewCustomer({
                            ...newCustomer,
                            isPerson: e.target.checked,
                            isOrganization: e.target.checked ? false : newCustomer.isOrganization
                        })}
                        style={{ marginRight: "5px" }}
                    />
                    Физ. лицо
                </label>
                <button onClick={handleCreate}>Добавить</button>
            </div>


            {editingCustomer && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        minWidth: '400px',
                        maxWidth: '600px'
                    }}>
                        <h3>Редактировать контрагента: {editingCustomer.customerCode}</h3>
                        <div style={{ marginBottom: '10px' }}>
                            <input
                                placeholder="Код контрагента"
                                value={editingCustomer.customerCode}
                                disabled
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />

                            <input
                                placeholder="Наименование"
                                value={editingCustomer.customerName}
                                onChange={e => setEditingCustomer({
                                    ...editingCustomer,
                                    customerName: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />
                            <input
                                placeholder="ИНН"
                                value={editingCustomer.customerInn}
                                onChange={e => setEditingCustomer({
                                    ...editingCustomer,
                                    customerInn: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />

                            <input
                                placeholder="КПП"
                                value={editingCustomer.customerKpp}
                                onChange={e => setEditingCustomer({
                                    ...editingCustomer,
                                    customerKpp: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />

                            <input
                                placeholder="Юр. адрес"
                                value={editingCustomer.customerLegalAddress}
                                onChange={e => setEditingCustomer({
                                    ...editingCustomer,
                                    customerLegalAddress: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />

                            <input
                                placeholder="Почтовый адрес"
                                value={editingCustomer.customerPostalAddress}
                                onChange={e => setEditingCustomer({
                                    ...editingCustomer,
                                    customerPostalAddress: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />

                            <input
                                placeholder="Электронная почта"
                                value={editingCustomer.customerEmail}
                                onChange={e => setEditingCustomer({
                                    ...editingCustomer,
                                    customerEmail: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />

                            <select
                                value={editingCustomer.customerCodeMain || ""}
                                onChange={e => setEditingCustomer({
                                    ...editingCustomer,
                                    customerCodeMain: e.target.value
                                })}
                                style={{ padding: "5px", minWidth: "200px" }}
                                disabled={loadingCustomersSimple}
                            >
                                <option value="">Вышестоящий контрагент</option>
                                {customersSimple.map(customer => (
                                    <option key={customer.customerCode} value={customer.customerCode}>
                                        {customer.customerName} ({customer.customerCode})
                                    </option>
                                ))}
                            </select>
                            {loadingCustomersSimple && <span style={{ marginLeft: "10px" }}>Загрузка...</span>}

                            <label style={{ marginRight: "10px" }}>
                                <input
                                    type="checkbox"
                                    checked={editingCustomer.isOrganization}
                                    onChange={e => setEditingCustomer({
                                        ...editingCustomer,
                                        isOrganization: e.target.checked,
                                        isPerson: e.target.checked ? false : editingCustomer.isPerson
                                    })}
                                    style={{ marginRight: "5px" }}
                                />
                                Юр. лицо
                            </label>

                            <label style={{ marginRight: "10px" }}>
                                <input
                                    type="checkbox"
                                    checked={editingCustomer.isPerson}
                                    onChange={e => setEditingCustomer({
                                        ...editingCustomer,
                                        isPerson: e.target.checked,
                                        isOrganization: e.target.checked ? false : editingCustomer.isOrganization
                                    })}
                                    style={{ marginRight: "5px" }}
                                />
                                Физ. лицо
                            </label>

                            <div style={{ marginTop: '15px' }}>
                                <button onClick={handleUpdate} style={{ marginRight: '10px' }}>
                                    Сохранить
                                </button>
                                <button onClick={cancelEdit} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div style={{ marginBottom: "10px" }}>
                <input
                    placeholder="Фильтр по названию"
                    value={filter.customerName}
                    onChange={e => setFilter({
                        ...filter,
                        customerName: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Фильтр по ИНН"
                    value={filter.customerInn}
                    onChange={e => setFilter({
                        ...filter,
                        customerInn: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Фильтр по КПП"
                    value={filter.customerKpp}
                    onChange={e => setFilter({
                        ...filter,
                        customerKpp: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Фильтр по юр. адресу"
                    value={filter.customerLegalAddress}
                    onChange={e => setFilter({
                        ...filter,
                        customerLegalAddress: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Фильтр по почтовому адресу"
                    value={filter.customerPostalAddress}
                    onChange={e => setFilter({
                        ...filter,
                        customerPostalAddress: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px", width: "200px" }}
                />

                <input
                    placeholder="Фильтр по электронной почте"
                    value={filter.customerEmail}
                    onChange={e => setFilter({
                        ...filter,
                        customerEmail: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px", width: "200px" }}
                />

                <select
                    value={filter.customerCodeMain || ""}
                    onChange={e => setFilter({
                        ...filter,
                        customerCodeMain: e.target.value
                    })}
                    style={{ padding: "5px", minWidth: "200px" }}
                    disabled={loadingCustomersSimple}
                >
                    <option value="">Фильтр по вышестоящему контрагенту</option>
                    {customersSimple.map(customer => (
                        <option key={customer.customerCode} value={customer.customerCode}>
                            {customer.customerName} ({customer.customerCode})
                        </option>
                    ))}
                </select>
                {loadingCustomersSimple && <span style={{ marginLeft: "10px" }}>Загрузка...</span>}


                <div></div>

                <label style={{ marginRight: "10px" }}>
                    <input
                        type="checkbox"
                        checked={filter.isOrganization === true}
                        onChange={e => {
                            const isChecked = e.target.checked;
                            setFilter({
                                ...filter,
                                isOrganization: isChecked,
                                isPerson: isChecked ? false : filter.isPerson
                            })
                        }}
                        style={{ marginRight: "5px" }}
                    />
                    Юр. лицо
                </label>

                <label style={{ marginRight: "10px" }}>
                    <input
                        type="checkbox"
                        checked={filter.isPerson === true}
                        onChange={e => {
                            const isChecked = e.target.checked;
                            setFilter({
                                ...filter,
                                isPerson: isChecked,
                                isOrganization: isChecked ? false : filter.isOrganization
                            })
                        }}
                        style={{ marginRight: "5px" }}
                    />
                    Физ. лицо
                </label>
                <button onClick={loadCustomers}>Применить фильтр</button>
                <button onClick={resetFilterHandler}>Сбросить фильтры</button>
            </div>




            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Код</th>
                            <th onClick={() => sortCustomers('customerName')} style={{ cursor: 'pointer', padding: '10px' }}>
                                Наименование
                                {sortConfig.key === 'customerName' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
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
                                <td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
                                    Нет данных
                                </td>
                            </tr>
                        ) : (
                            customers.map(customer => (
                                <tr key={customer.customerCode}>
                                    <td style={{ padding: "10px" }}>{customer.customerCode}</td>
                                    <td style={{ padding: "10px" }}>{customer.customerName}</td>
                                    <td style={{ padding: "10px" }}>{customer.customerInn || '-'}</td>
                                    <td style={{ padding: "10px" }}>{customer.customerKpp || '-'}</td>
                                    <td style={{ padding: "10px" }}>{customer.customerLegalAddress}</td>
                                    <td style={{ padding: "10px" }}>{customer.customerPostalAddress}</td>
                                    <td style={{ padding: "10px" }}>{customer.customerEmail}</td>
                                    <td style={{ padding: "10px" }}>{customer.customerCodeMain || '-'}</td>
                                    <td style={{ padding: "10px" }}>{customer.isOrganization ? 'Юр. лицо' : customer.isPerson ? 'Физ. лицо' : '-'}</td>
                                    <td style={{ padding: "10px" }}>
                                        <div><button onClick={() => handleDelete(customer.customerCode)}>Удалить</button></div>
                                        <div><button onClick={() => startEdit(customer)}>Обновить</button></div>
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