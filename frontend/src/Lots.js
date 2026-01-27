import React, { useState, useEffect } from "react";

import { getLots, createLot, deleteLot, updateLot, getCustomerSimpleList } from "./api";

function Lots() {
    const [lots, setLots] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    const [newLot, setNewLot] = useState({
        lotName: "",
        customerCode: "",
        price: "",
        currencyCode: "RUB",
        ndsRate: "Без НДС",
        placeDelivery: "",
        dateDelivery: ""
    });

    const [editingLot, setEditingLot] = useState(null);

    const [filter, setFilter] = useState({
        lotName: "",
        customerCode: "",
        minPrice: "",
        maxPrice: "",
        currencyCode: "",
        ndsRate: "",
        placeDelivery: "",
        dateDeliveryFrom: "",
        dateDeliveryTo: ""
    })

    const [sortConfig, setSortConfig] = useState({
        key: 'lotName',
        direction: 'asc'
    });

    const currencyOptions = ["RUB", "USD", "EUR"];
    const ndsOptions = ["Без НДС", "18%", "20%"]

    useEffect(() => {
        loadLots();
        loadCustomers();
    }, []);




    const loadLots = async () => {
        setLoading(true);
        try {
            const cleanFilter = {};

            if (filter.lotName) cleanFilter.lotName = filter.lotName;
            if (filter.customerCode) cleanFilter.customerCode = filter.customerCode;
            if (filter.minPrice) cleanFilter.minPrice = filter.minPrice;
            if (filter.maxPrice) cleanFilter.maxPrice = filter.maxPrice;
            if (filter.currencyCode) cleanFilter.currencyCode = filter.currencyCode;
            if (filter.ndsRate) cleanFilter.ndsRate = filter.ndsRate;
            if (filter.placeDelivery) cleanFilter.placeDelivery = filter.placeDelivery;
            if (filter.dateDeliveryTo) cleanFilter.dateDeliveryTo = filter.dateDeliveryTo;
            if (filter.dateDeliveryFrom) cleanFilter.dateDeliveryFrom = filter.dateDeliveryFrom;



            const data = await getLots(cleanFilter);
            setLots(data.content || data);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const loadCustomers = async () => {
        setLoadingCustomers(true);
        try {
            const data = await getCustomerSimpleList();
            setCustomers(data);
        } catch (error) {
            console.error('Ошибка загрузки контрагентов:', error);
            alert('Ошибка загрузки списка контрагентов');
        } finally {
            setLoadingCustomers(false);
        }
    };

    const handleCreate = async () => {
        if (!newLot.lotName && !newLot.customerCode) {
            alert('Необходимо заполнить обязательные поля: Наименование и Код контрагента');
            return;
        }
        let formattedDate = newLot.dateDelivery;
        if (formattedDate && !formattedDate.includes('T')) {
            formattedDate = formattedDate + 'T00:00';
        }

        const lotData = {
            ...newLot,
            price: newLot.price ? parseFloat(newLot.price) : 0,
            dateDelivery: formattedDate || null
        };

        try {
            await createLot(lotData);
            alert('Лот создан');

            setNewLot({
                lotName: "",
                customerCode: "",
                price: "",
                currencyCode: "RUB",
                ndsRate: "Без НДС",
                placeDelivery: "",
                dateDelivery: ""
            })

            loadLots();
        } catch (error) {
            console.error("Ошибка создания лота:", error);
            alert('Ошибка создания лота: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (lotName) => {
        if (window.confirm('Удалить лот?')) {
            try {
                await deleteLot(lotName);
                alert('Лот удалён');
                loadLots();
            } catch (error) {
                alert('Ошибка удаления лота ' + error.message);
            }
        }
    };

    const startEdit = (lot) => {
        let formattedDate = "";
        if (lot.dateDelivery) {
            try {
                const date = new Date(lot.dateDelivery);
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toISOString().slice(0, 16);
                }
            } catch (e) {
                console.error("Ошибка форматирования даты:", e);
            }
        }

        setEditingLot({
            ...lot,
            dateDelivery: formattedDate,
            price: lot.price ? lot.price.toString() : "0"
        });
    }

    const cancelEdit = () => {
        setEditingLot(null)
    }

    const handleUpdate = async () => {
        if (!editingLot) return;

        if (!editingLot.customerCode) {
            alert('Поле "Код контрагента" обязательно для заполнения');
            return;
        }

        let formattedDate = editingLot.dateDelivery;
        if (formattedDate && !formattedDate.includes('T')) {
            formattedDate = formattedDate + 'T00:00';
        } else if (formattedDate && formattedDate.length === 16) {
            formattedDate = formattedDate + ':00';
        }

        const updateData = {
            ...editingLot,
            price: editingLot.price ? parseFloat(editingLot.price) : 0,
            dateDelivery: formattedDate || null
        };

        console.log("Обновляемые данные:", updateData);

        try {
            await updateLot(editingLot.lotName, updateData);
            alert('Лот обновлён.');
            setEditingLot(null);
            loadLots();
        } catch (error) {
            console.error("Ошибка обновления:", error);
            alert("Ошибка обновления: " + (error.response?.data?.message || error.message));
        }
    }

    const resetFilterHandler = async () => {
        const resetFilter = {
            lotName: "",
            customerCode: "",
            minPrice: "",
            maxPrice: "",
            currencyCode: "",
            ndsRate: "",
            placeDelivery: "",
            dateDeliveryFrom: "",
            dateDeliveryTo: ""
        };

        setFilter(resetFilter);

        const cleanFilter = {};

        try {
            setLoading(true);
            const data = await getLots(cleanFilter);
            setLots(data.content || data);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const sortLots = (key) => {
        let direction = 'asc';

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });

        const sortedLots = [...lots].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setLots(sortedLots);
    };

    return (
        <div>
            <h1>Лоты</h1>
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>

                <h3>Добавить лот</h3>

                <input
                    placeholder="Наименование"
                    value={newLot.lotName}
                    onChange={e => setNewLot({
                        ...newLot,
                        lotName: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />
                <select
                    value={newLot.customerCode}
                    onChange={e => setNewLot({
                        ...newLot,
                        customerCode: e.target.value
                    })}
                    style={{ padding: "5px", minWidth: "200px" }}
                    disabled={loadingCustomers}
                >
                    <option value="">Выберите контрагента</option>
                    {customers.map(customer => (
                        <option key={customer.customerCode} value={customer.customerCode}>
                            {customer.customerName} ({customer.customerCode})
                        </option>
                    ))}
                </select>
                {loadingCustomers && <span style={{ marginLeft: "10px" }}>Загрузка...</span>}

                <input
                    placeholder="Начальная стоимость"
                    type="number"
                    min="0"
                    step="0.01"

                    onChange={e => setNewLot({
                        ...newLot,
                        price: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <select
                    value={newLot.currencyCode}
                    onChange={e => setNewLot({
                        ...newLot,
                        currencyCode: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                >
                    <option value="">Выберите валюту</option>
                    {currencyOptions.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>

                <select
                    value={newLot.ndsRate}
                    onChange={e => setNewLot({
                        ...newLot,
                        ndsRate: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                >
                    <option value="">Выберите код НДС</option>
                    {ndsOptions.map(nds => (
                        <option key={nds} value={nds}>{nds}</option>
                    ))}
                </select>

                <input
                    placeholder="Грузополучатель"
                    value={newLot.placeDelivery}
                    onChange={e => setNewLot({
                        ...newLot,
                        placeDelivery: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    type="datetime-local"
                    placeholder="Дата доставки"
                    value={newLot.dateDelivery}
                    onChange={e => setNewLot({
                        ...newLot,
                        dateDelivery: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />


                <button onClick={handleCreate}>Добавить</button>
            </div>


            {editingLot && (
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
                        <h3>Редактировать лот: {editingLot.lotName}</h3>
                        <div style={{ marginBottom: '10px' }}>

                            <input
                                placeholder="Наименование"
                                value={editingLot.lotName}
                                disabled
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />
                            <select
                                value={editingLot.customerCode}
                                onChange={e => setEditingLot({
                                    ...editingLot,
                                    customerCode: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "10px" }}
                                disabled={loadingCustomers}
                            >
                                <option value="">Выберите контрагента</option>
                                {customers.map(customer => (
                                    <option key={customer.customerCode} value={customer.customerCode}>
                                        {customer.customerName} ({customer.customerCode})
                                    </option>
                                ))}
                            </select>

                            <input
                                placeholder="Начальная стоимость"
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingLot.price}
                                onChange={e => setEditingLot({
                                    ...editingLot,
                                    price: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />

                            <select
                                value={editingLot.currencyCode}
                                onChange={e => setEditingLot({
                                    ...editingLot,
                                    currencyCode: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            >
                                <option value="">Выберите валюту</option>
                                {currencyOptions.map(currency => (
                                    <option key={currency} value={currency}>{currency}</option>
                                ))}
                            </select>


                            <select
                                value={editingLot.ndsRate}
                                onChange={e => setEditingLot({
                                    ...editingLot,
                                    ndsRate: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            >
                                <option value="">Выберите код НДС</option>
                                {ndsOptions.map(nds => (
                                    <option key={nds} value={nds}>{nds}</option>
                                ))}
                            </select>

                            <input
                                placeholder="Грузополучатель"
                                value={editingLot.placeDelivery}
                                onChange={e => setEditingLot({
                                    ...editingLot,
                                    placeDelivery: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px", width: "100%", marginBottom: "5px" }}
                            />

                            <input
                                type="datetime-local"
                                value={editingLot.dateDelivery}
                                onChange={e => setEditingLot({
                                    ...editingLot,
                                    dateDelivery: e.target.value
                                })}
                                style={{ marginRight: "10px", padding: "5px" }}
                            />



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
                    value={filter.lotName}
                    onChange={e => setFilter({
                        ...filter,
                        lotName: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <select
                    value={filter.customerCode}
                    onChange={e => setFilter({
                        ...filter,
                        customerCode: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px", marginBottom: "5px" }}
                    disabled={loadingCustomers}
                >
                    <option value="">Все контрагенты</option>
                    {customers.map(customer => (
                        <option key={customer.customerCode} value={customer.customerCode}>
                            {customer.customerCode}
                        </option>
                    ))}
                </select>

                <input
                    placeholder="Мин. начальная стоимость"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filter.minPrice}
                    onChange={e => setFilter({
                        ...filter,
                        minPrice: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    placeholder="Макс. начальная стоимость"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filter.maxPrice}
                    onChange={e => setFilter({
                        ...filter,
                        maxPrice: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <select
                    value={filter.currencyCode}
                    onChange={e => setFilter({
                        ...filter,
                        currencyCode: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                >
                    <option value="">Все валюты</option>
                    {currencyOptions.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>

                <select
                    value={filter.ndsRate}
                    onChange={e => setFilter({
                        ...filter,
                        ndsRate: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                >
                    <option value="">Все НДС</option>
                    {ndsOptions.map(nds => (
                        <option key={nds} value={nds}>{nds}</option>
                    ))}
                </select>

                <input
                    placeholder="Фильтр по грузополучателю"
                    value={filter.placeDelivery}
                    onChange={e => setFilter({
                        ...filter,
                        placeDelivery: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    type="datetime-local"
                    placeholder="Дата доставки с"
                    value={filter.dateDeliveryFrom}
                    onChange={e => setFilter({
                        ...filter,
                        dateDeliveryFrom: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />

                <input
                    type="datetime-local"
                    placeholder="Дата доставки по"
                    value={filter.dateDeliveryTo}
                    onChange={e => setFilter({
                        ...filter,
                        dateDeliveryTo: e.target.value
                    })}
                    style={{ marginRight: "10px", padding: "5px" }}
                />


                <button onClick={loadLots}>Применить фильтр</button>
                <button onClick={resetFilterHandler}>Сбросить фильтры</button>
            </div>




            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th onClick={() => sortLots('lotName')} style={{ cursor: 'pointer', padding: '10px' }}>
                                Наименование
                                {sortConfig.key === 'lotName' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th>Код контрагента</th>
                            <th onClick={() => sortLots('price')} style={{ cursor: 'pointer', padding: '10px' }}>
                                Начальная стоимость
                                {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th>Валюта</th>
                            <th>Код НДС</th>
                            <th>Грузополучатель</th>
                            <th onClick={() => sortLots('dateDelivery')} style={{ cursor: 'pointer', padding: '10px' }}>
                                Дата доставки
                                {sortConfig.key === 'dateDelivery' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lots.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                                    Нет данных
                                </td>
                            </tr>
                        ) : (
                            lots.map(lot => {
                                const customer = customers.find(c => c.customerCode === lot.customerCode);

                                const customerDisplay = customer ?
                                    `${customer.customerName} (${customer.customerCode})` :
                                    lot.customerCode;

                                return (<tr key={lot.lotName}>
                                    <td style={{ padding: "10px" }}>{lot.lotName}</td>
                                    <td style={{ padding: "10px" }}>{customerDisplay}</td>
                                    <td style={{ padding: "10px" }}>{lot.price}</td>
                                    <td style={{ padding: "10px" }}>{lot.currencyCode}</td>
                                    <td style={{ padding: "10px" }}>{lot.ndsRate}</td>
                                    <td style={{ padding: "10px" }}>{lot.placeDelivery}</td>
                                    <td style={{ padding: "10px" }}>
                                        {lot.dateDelivery
                                            ? new Date(lot.dateDelivery).toLocaleString('ru-RU', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : '-'}
                                    </td>
                                    <td style={{ padding: "10px" }}>
                                        <div><button onClick={() => handleDelete(lot.lotName)}>Удалить</button></div>
                                        <div><button onClick={() => startEdit(lot)}>Обновить</button></div>
                                    </td>
                                </tr>)
                            })
                        )}
                    </tbody>
                </table>

            )}
        </div>
    );
}
export default Lots;