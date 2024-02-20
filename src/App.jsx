import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [statements, setStatements] = useState(
    JSON.parse(localStorage.getItem('statements')) || []
  );
  const [input, setInput] = useState({
    statement: '',
    amount: '',
    statementType: 'income',
  });
  const [showError, setShowError] = useState({
    statement: false,
    amount: false,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Retrieve statements from localStorage
    const storedStatements = JSON.parse(localStorage.getItem('statements'));
    if (storedStatements) {
      setStatements(storedStatements);
    }
  }, []);

  useEffect(() => {
    // Save statements to localStorage
    localStorage.setItem('statements', JSON.stringify(statements));

    // Calculate total
    const newTotal = statements.reduce((sum, { type, amount }) => {
      return type === 'expense' ? sum - parseFloat(amount) : sum + parseFloat(amount);
    }, 0);
    setTotal(newTotal);
  }, [statements]);

  const renderTotal = () => {
    if (total > 0) {
      return <h1 className="total-text success">+{Math.abs(total)}</h1>;
    } else if (total < 0) {
      return <h1 className="total-text danger"> -{Math.abs(total)}</h1>;
    } else {
      return <h1 className="total-text">{Math.abs(total)}</h1>;
    }
  };

  const handleUpdateInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNewStatement = () => {
    const { statement, amount, statementType } = input;
    if (!statement) {
      return setShowError({
        statement: true,
        amount: false,
      });
    } else if (!amount) {
      return setShowError({
        statement: false,
        amount: true,
      });
    } else {
      setShowError({
        statement: false,
        amount: false,
      });
    }

    // Add logic to add statement
    setStatements([
      ...statements,
      {
        id: uuidv4(), // Generate unique id for each statement
        name: statement,
        amount: parseFloat(amount).toFixed(2),
        type: statementType,
        date: new Date().toDateString(),
      },
    ]);
    setInput({
      statement: '',
      amount: '',
      statementType: 'income',
    });
  };

  const handleClearList = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear the list? This will delete all your items.'
    );
    if (confirmClear) {
      localStorage.removeItem('statements');
      setStatements([]);
    }
  };

  return (
    <main>
      <div>
        {renderTotal()}
        <div className="input-container">
          <input
            type="text"
            placeholder="income or expense"
            onChange={handleUpdateInput}
            value={input.statement}
            name="statement"
            style={showError.statement ? { borderColor: 'rgb(206,76,76)' } : null}
          />
          <input
            type="number"
            placeholder="$Amount"
            onChange={handleUpdateInput}
            value={input.amount}
            name="amount"
            style={showError.amount ? { borderColor: 'rgb(206,76,76)' } : null}
          />
          <select
            onChange={handleUpdateInput}
            value={input.statementType}
            name="statementType"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button style={{ color: 'white', backgroundColor: 'black' }} 
           onClick={handleAddNewStatement}>+</button>
        </div>
        <div>
          {statements.map(({ id, name, type, amount, date }) => (
            <div className="card" key={id}>
              <div className="card-info">
                <h4>{name}</h4>
                <p>{date}</p>
              </div>
              <p className={`amount-text ${type === 'income' ? 'success' : 'danger'}`}>
                {type === 'income' ? '+' : '-'} ${amount}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={handleClearList}
          style={{
            backgroundColor: '#f44336',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            marginTop: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Clear List
        </button>
      </div>
    </main>
  );
}

export default App;
