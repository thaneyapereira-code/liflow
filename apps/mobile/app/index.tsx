import { dashboard, formatMoney, goalProgress } from "@liflow/domain";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const colors = { navy: "#0B1935", muted: "#75839A", green: "#20C994", blue: "#2688FF", line: "#E9EEF5", white: "#FFFFFF" };

function BrandMark() {
  return <View style={styles.mark}><View style={styles.markCut} /><View style={styles.markBlue} /></View>;
}

function Metric({ label, value, color = colors.navy, accent = colors.green, trend }: { label: string; value: number; color?: string; accent?: string; trend: string }) {
  return <View style={styles.metric}>
    <View style={styles.metricTop}><Text style={styles.metricLabel}>{label}</Text><View style={[styles.dot, { backgroundColor: accent }]} /></View>
    <Text style={[styles.metricValue, { color }]}>{formatMoney(value)}</Text>
    <Text style={[styles.metricTrend, { color: accent }]}>↗ {trend}</Text>
  </View>;
}

export default function DashboardScreen() {
  return <View style={styles.screen}>
    <StatusBar barStyle="dark-content" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topbar}><View style={styles.brand}><BrandMark /><Text style={styles.brandText}>LIFLOW</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>T</Text></View></View>

      <View style={styles.hello}><Text style={styles.helloTitle}>Olá, {dashboard.user} ✦</Text><Text style={styles.helloText}>Aqui está o resumo do seu mês.</Text></View>

      <View style={styles.balanceCard}>
        <View style={styles.cardTop}><Text style={styles.cardLabel}>Saldo atual</Text><Text style={styles.month}>Julho⌄</Text></View>
        <Text style={styles.balance}>{formatMoney(dashboard.balance)}</Text><Text style={styles.okay}>Tudo certo por aqui</Text>
        <View style={styles.divider} />
        <View style={styles.balanceFooter}><View><Text style={styles.miniLabel}>↗ Receitas</Text><Text style={styles.income}>{formatMoney(dashboard.income)}</Text></View><View><Text style={styles.miniLabel}>↘ Despesas</Text><Text style={styles.expense}>{formatMoney(dashboard.expenses)}</Text></View></View>
      </View>

      <Text style={styles.sectionTitle}>Resumo do mês</Text>
      <View style={styles.metrics}><Metric label="Receitas" value={dashboard.income} trend="8%" /><Metric label="Despesas" value={dashboard.expenses} color="#E44E66" accent="#E44E66" trend="5%" /></View>

      <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Fluxos</Text><TouchableOpacity><Text style={styles.link}>Ver todos</Text></TouchableOpacity></View>
      <View style={styles.panel}>
        {dashboard.flows.map((flow, index) => <View style={[styles.flow, index > 0 && styles.rowBorder]} key={flow.id}>
          <View style={styles.flag}><Text>{flow.countryCode === "BR" ? "🇧🇷" : "🇵🇹"}</Text></View><View style={styles.flowCopy}><Text style={styles.flowName}>{flow.name}</Text><Text style={styles.flowLabel}>Saldo disponível</Text></View><Text style={[styles.flowValue, flow.balance < 0 && styles.expense]}>{formatMoney(flow.balance)}</Text>
        </View>)}
      </View>

      <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Metas</Text><TouchableOpacity><Text style={styles.link}>Ver todas</Text></TouchableOpacity></View>
      <View style={styles.panel}>
        {dashboard.goals.slice(0, 2).map((goal, index) => <View style={[styles.goal, index > 0 && styles.rowBorder]} key={goal.id}>
          <View style={[styles.goalIcon, { backgroundColor: `${goal.accent}18` }]}><Text>◎</Text></View><View style={styles.goalCopy}><View style={styles.goalTop}><Text style={styles.flowName}>{goal.name}</Text><Text style={styles.percent}>{goalProgress(goal)}%</Text></View><Text style={styles.flowLabel}>{formatMoney(goal.current)} de {formatMoney(goal.target)}</Text><View style={styles.progress}><View style={{ width: `${goalProgress(goal)}%`, height: 5, borderRadius: 5, backgroundColor: goal.accent }} /></View></View>
        </View>)}
      </View>
      <View style={{ height: 38 }} />
    </ScrollView>

    <View style={styles.bottomNav}>
      <View style={styles.navActive}><Text style={styles.navIcon}>⌂</Text><Text style={styles.navTextActive}>Resumo</Text></View><View style={styles.navItem}><Text style={styles.navIcon}>▤</Text><Text style={styles.navText}>Transações</Text></View>
      <TouchableOpacity style={styles.add}><Text style={styles.addText}>＋</Text></TouchableOpacity>
      <View style={styles.navItem}><Text style={styles.navIcon}>⌁</Text><Text style={styles.navText}>Fluxos</Text></View><View style={styles.navItem}><Text style={styles.navIcon}>•••</Text><Text style={styles.navText}>Mais</Text></View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F8FC" }, content: { paddingHorizontal: 18, paddingTop: 58, paddingBottom: 84 },
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, brand: { flexDirection: "row", alignItems: "center", gap: 8 }, brandText: { color: colors.navy, fontSize: 16, fontWeight: "800", letterSpacing: 2.5 },
  mark: { width: 27, height: 27, borderRadius: 8, backgroundColor: colors.green, overflow: "hidden" }, markCut: { position: "absolute", right: -1, top: -1, width: 16, height: 16, backgroundColor: "white", borderBottomLeftRadius: 10 }, markBlue: { position: "absolute", right: 0, bottom: 0, width: 17, height: 10, backgroundColor: colors.blue, borderTopLeftRadius: 10 }, avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" }, avatarText: { color: "white", fontWeight: "800" },
  hello: { marginTop: 28, marginBottom: 17 }, helloTitle: { color: colors.navy, fontSize: 22, fontWeight: "800" }, helloText: { color: colors.muted, fontSize: 12, marginTop: 5 },
  balanceCard: { backgroundColor: colors.white, borderRadius: 18, padding: 18, shadowColor: "#183556", shadowOpacity: .07, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 }, cardTop: { flexDirection: "row", justifyContent: "space-between" }, cardLabel: { color: colors.muted, fontSize: 11 }, month: { backgroundColor: "#F3F6FA", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5, color: colors.muted, fontSize: 9 }, balance: { color: "#13A97D", fontSize: 27, fontWeight: "800", marginTop: 10 }, okay: { color: colors.navy, fontSize: 10, marginTop: 4 }, divider: { height: 1, backgroundColor: colors.line, marginVertical: 16 }, balanceFooter: { flexDirection: "row", justifyContent: "space-between", paddingRight: 45 }, miniLabel: { color: colors.muted, fontSize: 9 }, income: { color: "#16AE81", fontSize: 12, fontWeight: "700", marginTop: 3 }, expense: { color: "#E44E66", fontSize: 12, fontWeight: "700", marginTop: 3 },
  sectionTitle: { color: colors.navy, fontSize: 15, fontWeight: "800", marginTop: 23, marginBottom: 12 }, metrics: { flexDirection: "row", gap: 10 }, metric: { flex: 1, backgroundColor: "white", borderRadius: 15, padding: 14 }, metricTop: { flexDirection: "row", justifyContent: "space-between" }, metricLabel: { color: colors.muted, fontSize: 9 }, dot: { width: 7, height: 7, borderRadius: 4 }, metricValue: { fontSize: 15, fontWeight: "800", marginTop: 13 }, metricTrend: { fontSize: 9, fontWeight: "700", marginTop: 7 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, link: { color: colors.blue, fontSize: 10, fontWeight: "700", marginTop: 11 }, panel: { backgroundColor: "white", borderRadius: 16, paddingHorizontal: 15 }, flow: { minHeight: 67, flexDirection: "row", alignItems: "center" }, rowBorder: { borderTopWidth: 1, borderTopColor: colors.line }, flag: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#F0F5F8", alignItems: "center", justifyContent: "center" }, flowCopy: { marginLeft: 11, flex: 1 }, flowName: { color: colors.navy, fontSize: 11, fontWeight: "700" }, flowLabel: { color: colors.muted, fontSize: 8, marginTop: 4 }, flowValue: { color: "#13A97D", fontSize: 10, fontWeight: "700" },
  goal: { minHeight: 79, flexDirection: "row", alignItems: "center" }, goalIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" }, goalCopy: { flex: 1, marginLeft: 11 }, goalTop: { flexDirection: "row", justifyContent: "space-between" }, percent: { color: colors.muted, fontSize: 9, fontWeight: "700" }, progress: { height: 5, backgroundColor: "#EEF2F6", borderRadius: 5, marginTop: 8, overflow: "hidden" },
  bottomNav: { position: "absolute", left: 0, right: 0, bottom: 0, height: 76, paddingHorizontal: 15, paddingBottom: 8, backgroundColor: "rgba(255,255,255,.98)", borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }, navItem: { alignItems: "center", minWidth: 50 }, navActive: { alignItems: "center", minWidth: 50 }, navIcon: { color: colors.muted, fontSize: 18 }, navText: { color: colors.muted, fontSize: 8, marginTop: 3 }, navTextActive: { color: colors.blue, fontSize: 8, marginTop: 3, fontWeight: "700" }, add: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", shadowColor: colors.blue, shadowOpacity: .25, shadowRadius: 8, elevation: 4 }, addText: { color: "white", fontSize: 25, marginTop: -2 }
});

