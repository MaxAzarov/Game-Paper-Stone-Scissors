"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("@apollo/client");
const GetUsersStatistics_1 = __importDefault(require("../../graphql/Query/GetUsersStatistics"));
const Spinner_1 = __importDefault(require("../../../Common/components/Spinner/Spinner"));
require("./Statistics.scss");
const Menu_1 = __importDefault(require("../../../Common/components/Menu/Menu"));
const Statistics = () => {
    const { data, loading } = client_1.useQuery(GetUsersStatistics_1.default);
    if (loading) {
        return <Spinner_1.default></Spinner_1.default>;
    }
    return (<section className="users-statistics">
      <Menu_1.default />
      <img src={require("./../../../Common/components/Home/logo2.png")} alt="" className="users-statistics__logo"/>
      <div className="users-statistics__wrapper">
        <span>Best users:</span>
        {data &&
        data.getUsersStatistics.data.map((item, index) => {
            return (<div key={index} className="users-statistics__item item-statistics">
                <p className="item-statistics__name">{item.nickname}</p>
                <p className="item-statistics__percent">{item.percentOfWin}</p>
              </div>);
        })}
      </div>
    </section>);
};
exports.default = Statistics;
